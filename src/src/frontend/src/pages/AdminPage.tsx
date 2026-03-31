import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Lock,
  LogOut,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  type ConditionType,
  type TreatmentPlan,
  getStoredTreatments,
  saveTreatments,
} from "../data/treatmentData";

const ADMIN_PASSWORD = "AcneVeda2024";

const CONDITION_LABELS: Record<
  ConditionType,
  { label: string; badge: string }
> = {
  whitehead: { label: "Whitehead", badge: "bg-amber-100 text-amber-800" },
  blackhead: { label: "Blackhead", badge: "bg-stone-200 text-stone-800" },
  papule: { label: "Papule", badge: "bg-rose-100 text-rose-800" },
  pustule: { label: "Pustule", badge: "bg-red-100 text-red-800" },
  nodular: { label: "Nodular Acne", badge: "bg-purple-100 text-purple-800" },
};

const ALL_CONDITIONS: ConditionType[] = [
  "whitehead",
  "blackhead",
  "papule",
  "pustule",
  "nodular",
];

// ---- Treatment Editor ----

function TreatmentEditor({
  condition,
  plan,
  onSave,
}: {
  condition: ConditionType;
  plan: TreatmentPlan;
  onSave: (condition: ConditionType, updated: TreatmentPlan) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [local, setLocal] = useState<TreatmentPlan>(plan);

  const handleMedChange = (idx: number, field: string, val: string) => {
    setLocal((prev) => {
      const meds = prev.internalMedicines.map((m, i) =>
        i === idx ? { ...m, [field]: val } : m,
      );
      return { ...prev, internalMedicines: meds };
    });
  };

  const handleLepaChange = (idx: number, field: string, val: string) => {
    setLocal((prev) => {
      const lepas = prev.externalLepas.map((l, i) =>
        i === idx ? { ...l, [field]: val } : l,
      );
      return { ...prev, externalLepas: lepas };
    });
  };

  const handleDietChange = (type: "include" | "avoid", val: string) => {
    const arr = val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setLocal((prev) => ({
      ...prev,
      diet: { ...prev.diet, [type]: arr },
    }));
  };

  const handleSave = () => {
    onSave(condition, local);
    toast.success("Treatment plan saved successfully");
  };

  const info = CONDITION_LABELS[condition];

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="cursor-pointer select-none flex flex-row items-center justify-between py-4"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${info.badge}`}
          >
            {info.label}
          </span>
          <span className="text-sm text-muted-foreground">
            {local.internalMedicines.length} medicines ·{" "}
            {local.externalLepas.length} lepas
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6 pt-0">
          {/* Internal Medicines */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">
              Internal Medicines
            </h4>
            <div className="space-y-4">
              {local.internalMedicines.map((med, idx) => (
                <div
                  key={med.name}
                  className="grid grid-cols-1 gap-2 p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs shrink-0">
                      {med.type}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      {med.name}
                    </span>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Name
                    </Label>
                    <Input
                      value={med.name}
                      onChange={(e) =>
                        handleMedChange(idx, "name", e.target.value)
                      }
                      className="mt-1 h-8 text-sm"
                      data-ocid={`admin.medicine_${idx}_name.input`}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Dosage
                    </Label>
                    <Input
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedChange(idx, "dosage", e.target.value)
                      }
                      className="mt-1 h-8 text-sm"
                      data-ocid={`admin.medicine_${idx}_dosage.input`}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Purpose
                    </Label>
                    <Input
                      value={med.purpose}
                      onChange={(e) =>
                        handleMedChange(idx, "purpose", e.target.value)
                      }
                      className="mt-1 h-8 text-sm"
                      data-ocid={`admin.medicine_${idx}_purpose.input`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* External Lepas */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">
              External Lepas
            </h4>
            <div className="space-y-4">
              {local.externalLepas.map((lepa, idx) => (
                <div
                  key={lepa.name}
                  className="grid grid-cols-1 gap-2 p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Name
                    </Label>
                    <Input
                      value={lepa.name}
                      onChange={(e) =>
                        handleLepaChange(idx, "name", e.target.value)
                      }
                      className="mt-1 h-8 text-sm"
                      data-ocid={`admin.lepa_${idx}_name.input`}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Ingredients
                    </Label>
                    <Input
                      value={lepa.ingredients}
                      onChange={(e) =>
                        handleLepaChange(idx, "ingredients", e.target.value)
                      }
                      className="mt-1 h-8 text-sm"
                      data-ocid={`admin.lepa_${idx}_ingredients.input`}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      How to Use
                    </Label>
                    <Textarea
                      value={lepa.howToUse}
                      onChange={(e) =>
                        handleLepaChange(idx, "howToUse", e.target.value)
                      }
                      className="mt-1 text-sm"
                      rows={2}
                      data-ocid={`admin.lepa_${idx}_how_to_use.textarea`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diet */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Diet</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Include (comma-separated)
                </Label>
                <Textarea
                  value={local.diet.include.join(", ")}
                  onChange={(e) => handleDietChange("include", e.target.value)}
                  className="mt-1 text-sm"
                  rows={4}
                  data-ocid="admin.diet_include.textarea"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Avoid (comma-separated)
                </Label>
                <Textarea
                  value={local.diet.avoid.join(", ")}
                  onChange={(e) => handleDietChange("avoid", e.target.value)}
                  className="mt-1 text-sm"
                  rows={4}
                  data-ocid="admin.diet_avoid.textarea"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full"
            data-ocid="admin.treatment.save_button"
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

// ---- AI Training ----

type ClassImages = Record<ConditionType, File[]>;

function imageToTensor(imgEl: HTMLImageElement): any {
  const canvas = document.createElement("canvas");
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imgEl, 0, 0, 224, 224);
  return tf.browser.fromPixels(canvas).toFloat().div(255) as any;
}

function loadImageFile(file: File): Promise<HTMLImageElement> {
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

function AITraining() {
  const [classImages, setClassImages] = useState<ClassImages>({
    whitehead: [],
    blackhead: [],
    papule: [],
    pustule: [],
    nodular: [],
  });
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLoss, setCurrentLoss] = useState<number | null>(null);
  const [trained, setTrained] = useState(() => {
    try {
      const raw = localStorage.getItem("acneveda_trained_model_info");
      return raw ? JSON.parse(raw).trained === true : false;
    } catch {
      return false;
    }
  });
  const fileRefs = useRef<Record<ConditionType, HTMLInputElement | null>>({
    whitehead: null,
    blackhead: null,
    papule: null,
    pustule: null,
    nodular: null,
  });

  const handleUpload = (condition: ConditionType, files: FileList | null) => {
    if (!files) return;
    setClassImages((prev) => ({
      ...prev,
      [condition]: [...prev[condition], ...Array.from(files)],
    }));
  };

  const canTrain = ALL_CONDITIONS.every((c) => classImages[c].length >= 1);

  const handleTrain = async () => {
    setIsTraining(true);
    setProgress(0);
    setCurrentLoss(null);

    try {
      // Load MobileNet
      const net = await mobilenet.load();

      // Gather embeddings and labels
      const allEmbeddings: any[] = [];
      const allLabels: number[] = [];

      for (let ci = 0; ci < ALL_CONDITIONS.length; ci++) {
        const cond = ALL_CONDITIONS[ci];
        for (const file of classImages[cond]) {
          const img = await loadImageFile(file);
          const tensor = imageToTensor(img);
          const embedding = net.infer(tensor, true);
          allEmbeddings.push(embedding);
          allLabels.push(ci);
          tensor.dispose();
        }
      }

      const xs = tf.stack(allEmbeddings);
      for (const t of allEmbeddings) {
        t.dispose();
      }

      const ys = tf.oneHot(
        tf.tensor1d(allLabels, "int32"),
        ALL_CONDITIONS.length,
      );

      // Build model on top of embeddings
      const embeddingSize = xs.shape[1] as number;
      const model = tf.sequential();
      model.add(
        tf.layers.dense({
          inputShape: [embeddingSize],
          units: 128,
          activation: "relu",
        }),
      );
      model.add(tf.layers.dense({ units: 64, activation: "relu" }));
      model.add(
        tf.layers.dense({
          units: ALL_CONDITIONS.length,
          activation: "softmax",
        }),
      );

      model.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      const EPOCHS = 30;
      await model.fit(xs, ys, {
        epochs: EPOCHS,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            setProgress(Math.round(((epoch + 1) / EPOCHS) * 100));
            if (logs?.loss !== undefined)
              setCurrentLoss(Number(logs.loss.toFixed(4)));
          },
        },
      });

      xs.dispose();
      ys.dispose();

      await model.save("localstorage://acneveda_model");
      localStorage.setItem(
        "acneveda_trained_model_info",
        JSON.stringify({ trained: true, classes: ALL_CONDITIONS }),
      );

      setTrained(true);
      toast.success(
        "Model trained and saved! The scan page will now use your custom model.",
      );
    } catch (err) {
      console.error(err);
      toast.error("Training failed. Please try again.");
    } finally {
      setIsTraining(false);
    }
  };

  const handleClearModel = () => {
    localStorage.removeItem("acneveda_trained_model_info");
    // TF localstorage keys
    for (const k of [
      "acneveda_model/model.json",
      "acneveda_model/weights.bin",
    ]) {
      localStorage.removeItem(k);
    }
    setTrained(false);
    setProgress(0);
    setCurrentLoss(null);
    setClassImages({
      whitehead: [],
      blackhead: [],
      papule: [],
      pustule: [],
      nodular: [],
    });
    toast.success("Saved model cleared.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="w-5 h-5 text-primary" />
            Train Custom AI Model
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload labeled skin photos for each lesion type. The model will be
            trained in your browser using MobileNet transfer learning.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {ALL_CONDITIONS.map((cond) => {
            const info = CONDITION_LABELS[cond];
            return (
              <div
                key={cond}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-muted/20"
              >
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${info.badge}`}
                >
                  {info.label}
                </span>
                <span className="text-sm text-muted-foreground flex-1">
                  {classImages[cond].length === 0
                    ? "No images uploaded"
                    : `${classImages[cond].length} image${classImages[cond].length > 1 ? "s" : ""} ready`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileRefs.current[cond]?.click()}
                  disabled={isTraining}
                  data-ocid="admin.training.upload_button"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload
                </Button>
                <input
                  ref={(el) => {
                    fileRefs.current[cond] = el;
                  }}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(cond, e.target.files)}
                />
              </div>
            );
          })}

          {isTraining && (
            <div className="space-y-2" data-ocid="admin.training.loading_state">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Training… epoch {Math.round((progress / 100) * 30)}/30
                </span>
                {currentLoss !== null && <span>Loss: {currentLoss}</span>}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {trained && !isTraining && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm"
              data-ocid="admin.training.success_state"
            >
              <span className="text-lg">✅</span>
              <span>
                Custom model active — the Scan page is using your trained model.
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleTrain}
              disabled={!canTrain || isTraining}
              className="flex-1"
              data-ocid="admin.training.primary_button"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isTraining ? "Training…" : "Train Model"}
            </Button>
            {trained && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleClearModel}
                disabled={isTraining}
                data-ocid="admin.training.delete_button"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          {!canTrain && (
            <p className="text-xs text-muted-foreground text-center">
              Upload at least 1 image per lesion type to enable training.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Main AdminPage ----

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [treatments, setTreatments] = useState<
    Record<ConditionType, TreatmentPlan>
  >(() => getStoredTreatments());

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleSaveCondition = (
    condition: ConditionType,
    updated: TreatmentPlan,
  ) => {
    const next = { ...treatments, [condition]: updated };
    setTreatments(next);
    saveTreatments(next);
  };

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <img
              src="/assets/uploads/beige_and_green_minimal_ayurveda_company_logo_20260329_160220_0000-019d3d43-5763-7149-b499-c52ab9b218f8-1.jpg"
              alt="Acne Veda"
              className="h-16 w-auto mx-auto mb-4 object-contain"
            />
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Admin Access
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your password to continue
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Enter admin password"
                    className="pl-10"
                    data-ocid="admin.password.input"
                  />
                </div>
              </div>
              {error && (
                <p
                  className="text-sm text-destructive font-medium"
                  data-ocid="admin.password.error_state"
                >
                  {error}
                </p>
              )}
              <Button
                onClick={handleLogin}
                className="w-full"
                data-ocid="admin.login.primary_button"
              >
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Acne Veda — Dr. Akash Hari (BAMS)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setUnlocked(false);
              setPassword("");
            }}
            data-ocid="admin.logout.button"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="treatments">
          <TabsList className="w-full sm:w-auto" data-ocid="admin.tabs">
            <TabsTrigger value="treatments" data-ocid="admin.treatments.tab">
              Treatment Plans
            </TabsTrigger>
            <TabsTrigger value="training" data-ocid="admin.training.tab">
              AI Training
            </TabsTrigger>
          </TabsList>

          <TabsContent value="treatments" className="space-y-4 mt-6">
            <p className="text-sm text-muted-foreground">
              Edit treatment plans for each acne condition. Changes are saved to
              your browser and applied immediately on the Scan page.
            </p>
            {ALL_CONDITIONS.map((cond) => (
              <TreatmentEditor
                key={cond}
                condition={cond}
                plan={treatments[cond]}
                onSave={handleSaveCondition}
              />
            ))}
          </TabsContent>

          <TabsContent value="training" className="mt-6">
            <AITraining />
          </TabsContent>
        </Tabs>

        <footer className="text-center text-xs text-muted-foreground pt-4">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </main>
  );
}
