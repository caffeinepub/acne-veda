import type { ConditionType } from "../data/treatmentData";
import { loadTf } from "./tfLoader";

export interface DetectedCondition {
  type: ConditionType;
  confidence: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function pctToConfidence(pct: number, lo: number, hi: number): number {
  const norm = (pct - lo) / (hi - lo);
  return Math.round(clamp(65 + norm * 28, 65, 93));
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [h * 360, s, l];
}

function extractFeatures(img: HTMLImageElement): number[] {
  const SIZE = 32;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, SIZE, SIZE);
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const features: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    features.push(data[i] / 255);
    features.push(data[i + 1] / 255);
    features.push(data[i + 2] / 255);
  }
  return features;
}

async function tryTrainedModel(
  img: HTMLImageElement,
): Promise<DetectedCondition[] | null> {
  try {
    const raw = localStorage.getItem("acneveda_trained_model_info");
    if (!raw) return null;
    const info = JSON.parse(raw) as {
      trained: boolean;
      classes: string[];
      featureSize?: number;
    };
    if (!info.trained || !info.classes?.length) return null;

    const tf = await loadTf();
    const model = await tf.loadLayersModel("localstorage://acneveda_model");
    const features = extractFeatures(img);
    const tensor = tf.tensor2d([features]);
    const preds = model.predict(tensor);
    const probs = await preds.data();
    tensor.dispose();
    preds.dispose();
    model.dispose();

    const results: DetectedCondition[] = [];
    info.classes.forEach((cls: string, idx: number) => {
      const prob = probs[idx] ?? 0;
      if (prob > 0.15) {
        results.push({
          type: cls as ConditionType,
          confidence: Math.round(prob * 100),
        });
      }
    });

    return results.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  } catch {
    return null;
  }
}

export async function analyzeImage(file: File): Promise<DetectedCondition[]> {
  const img = await loadImage(file);

  const modelResults = await tryTrainedModel(img);
  if (modelResults !== null) return modelResults;

  // Color analysis fallback
  const canvas = document.createElement("canvas");
  const MAX = 320;
  const scale = Math.min(1, MAX / Math.max(img.width, img.height));
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const totalPx = width * height;

  const cx0 = Math.floor(width * 0.15);
  const cx1 = Math.floor(width * 0.85);
  const cy0 = Math.floor(height * 0.15);
  const cy1 = Math.floor(height * 0.85);

  const skinSamples: RGB[] = [];
  for (let y = cy0; y < cy1; y++) {
    for (let x = cx0; x < cx1; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const [, s, l] = rgbToHsl(r, g, b);
      if (
        r > 60 &&
        r > b &&
        r >= g * 0.8 &&
        s > 0.05 &&
        s < 0.9 &&
        l > 0.15 &&
        l < 0.9
      ) {
        skinSamples.push({ r, g, b });
      }
    }
  }

  let skinR = 160;
  let skinG = 120;
  let skinB = 100;
  if (skinSamples.length > 20) {
    skinR = skinSamples.reduce((s, p) => s + p.r, 0) / skinSamples.length;
    skinG = skinSamples.reduce((s, p) => s + p.g, 0) / skinSamples.length;
    skinB = skinSamples.reduce((s, p) => s + p.b, 0) / skinSamples.length;
  }

  const skinL = rgbToHsl(skinR, skinG, skinB)[2];

  let blackCount = 0;
  let whiteCount = 0;
  let papuleCount = 0;
  let pustuleCount = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const [h, s, l] = rgbToHsl(r, g, b);

    if (l < skinL - 0.22 && l < 0.45 && s < 0.5) blackCount++;
    if (l > skinL + 0.2 && l > 0.72 && s < 0.35) whiteCount++;
    const isRed = h >= 345 || h <= 20;
    if (isRed && s > 0.35 && l > 0.25 && l < 0.75 && r > g + 20 && r > b + 20)
      papuleCount++;
    if (
      h >= 25 &&
      h <= 75 &&
      s > 0.15 &&
      s < 0.65 &&
      l > 0.65 &&
      r > 170 &&
      g > 150
    )
      pustuleCount++;
  }

  const blackPct = (blackCount / totalPx) * 100;
  const whitePct = (whiteCount / totalPx) * 100;
  const papulePct = (papuleCount / totalPx) * 100;
  const pustulePct = (pustuleCount / totalPx) * 100;

  const candidates: DetectedCondition[] = [];

  if (blackPct > 3.5)
    candidates.push({
      type: "blackhead",
      confidence: pctToConfidence(blackPct, 3.5, 8),
    });
  if (whitePct > 2.5)
    candidates.push({
      type: "whitehead",
      confidence: pctToConfidence(whitePct, 2.5, 6),
    });
  if (papulePct > 1.5)
    candidates.push({
      type: "papule",
      confidence: pctToConfidence(papulePct, 1.5, 5),
    });
  if (pustulePct > 1.0)
    candidates.push({
      type: "pustule",
      confidence: pctToConfidence(pustulePct, 1.0, 4),
    });

  return candidates.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}
