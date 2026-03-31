// Load TensorFlow.js from CDN at runtime — avoids build-time dependency requirement
let tfLoadPromise: Promise<any> | null = null;

export function loadTf(): Promise<any> {
  if ((window as any).tf) return Promise.resolve((window as any).tf);
  if (tfLoadPromise) return tfLoadPromise;

  tfLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js";
    script.onload = () => resolve((window as any).tf);
    script.onerror = () =>
      reject(new Error("Failed to load TensorFlow.js from CDN"));
    document.head.appendChild(script);
  });

  return tfLoadPromise;
}
