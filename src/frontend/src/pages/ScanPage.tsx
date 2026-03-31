import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ScanLine,
  Upload,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { TreatmentPanel } from "../components/TreatmentPanel";
import {
  CONDITION_INFO,
  type ConditionType,
  getStoredTreatments,
} from "../data/treatmentData";
import { type DetectedCondition, analyzeImage } from "../utils/acneAnalysis";

export function ScanPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<DetectedCondition[] | null>(null);
  const [expandedCondition, setExpandedCondition] =
    useState<ConditionType | null>(null);
  const [patientName, setPatientName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResults(null);
    setExpandedCondition(null);
    setIsScanning(true);
    const detected = await analyzeImage(file);
    setResults(detected);
    setIsScanning(false);
    if (detected.length > 0) setExpandedCondition(detected[0].type);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  const handleReset = () => {
    setImageUrl(null);
    setResults(null);
    setExpandedCondition(null);
    setIsScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const confidenceColor = (c: number) =>
    c >= 90
      ? "bg-red-100 text-red-700"
      : c >= 80
        ? "bg-amber-100 text-amber-700"
        : "bg-blue-100 text-blue-700";

  const treatments = getStoredTreatments();

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Skin <span className="text-primary">Analysis</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload a clear photo of your skin. Our system detects acne
            conditions using real pixel analysis and provides personalised
            Ayurvedic treatment plans.
          </p>
        </motion.div>

        {/* Patient Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-sm mb-8"
        >
          <Label
            htmlFor="patient-name"
            className="flex items-center gap-1.5 mb-1.5 text-sm font-semibold text-foreground"
          >
            <User className="w-4 h-4 text-primary" />
            Patient Name
          </Label>
          <Input
            id="patient-name"
            type="text"
            placeholder="Enter patient name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            data-ocid="scan.patient_name.input"
            className="border-primary/30 focus-visible:ring-primary/40"
          />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Panel */}
          <div className="space-y-4">
            {!imageUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border-2 border-dashed border-primary/30 bg-card p-8 flex flex-col items-center justify-center gap-5 min-h-[300px] cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                data-ocid="scan.dropzone"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    Drop your image here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse your files
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports JPG, PNG, WEBP
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    data-ocid="scan.upload_button"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    data-ocid="scan.camera_button"
                  >
                    <Camera className="w-4 h-4 mr-2" /> Use Camera
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl overflow-hidden border border-border shadow-warm relative"
              >
                <img
                  src={imageUrl}
                  alt="Uploaded skin scan"
                  className="w-full aspect-[4/3] object-cover"
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-3">
                    <ScanLine className="w-10 h-10 text-primary animate-pulse" />
                    <p className="font-semibold text-foreground">
                      Analysing pixel data…
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Running TensorFlow colour analysis
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {imageUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full"
                data-ocid="scan.reset_button"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Scan New Photo
              </Button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Tips */}
            <div className="rounded-xl bg-muted/40 border border-border p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                📸 Tips for best results
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use natural lighting, avoid flash</li>
                <li>• Ensure face is clean and makeup-free</li>
                <li>• Hold camera 15–20 cm from skin</li>
                <li>• Capture the affected area clearly</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {!results && !isScanning && !imageUrl && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-3 min-h-[300px] text-center p-8"
                  data-ocid="scan.empty_state"
                >
                  <ScanLine className="w-10 h-10 text-muted-foreground/40" />
                  <p className="font-semibold text-muted-foreground">
                    Results will appear here
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Upload a photo to begin analysis
                  </p>
                </motion.div>
              )}
              {isScanning && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]"
                  data-ocid="scan.loading_state"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <p className="font-semibold">Detecting conditions…</p>
                  <p className="text-sm text-muted-foreground">
                    Pixel-level TensorFlow analysis in progress
                  </p>
                </motion.div>
              )}
              {results && results.length === 0 && (
                <motion.div
                  key="no-conditions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center flex flex-col items-center justify-center gap-4"
                  data-ocid="scan.success_state"
                >
                  <span className="text-5xl">🌿</span>
                  <div className="space-y-1">
                    <p className="font-serif text-2xl font-bold text-green-800">
                      Clear Skin
                    </p>
                    <p className="text-sm font-medium text-green-700">
                      No acne lesions detected
                    </p>
                  </div>
                  <Separator className="bg-green-200 w-3/4" />
                  <div className="text-sm text-green-700 space-y-2 text-left w-full">
                    <p className="font-semibold text-green-800">
                      Maintain your clear skin with:
                    </p>
                    <ul className="space-y-1.5">
                      <li>
                        🌅 Follow a consistent daily Dinacharya (daily routine)
                      </li>
                      <li>🥗 Eat a Pitta-balancing, seasonal diet</li>
                      <li>
                        💧 Stay well-hydrated with warm water and herbal teas
                      </li>
                      <li>
                        🦴 Use gentle, natural cleansers suited to your Prakriti
                      </li>
                      <li>😴 Prioritise 7–8 hours of restful sleep</li>
                    </ul>
                  </div>
                  <p className="text-xs text-green-600 italic">
                    Consult Dr. Akash Hari (BAMS) for a personalised Ayurvedic
                    wellness plan.
                  </p>
                </motion.div>
              )}
              {results && results.length > 0 && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                  data-ocid="scan.results.panel"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-semibold">
                      Detected Conditions
                    </h2>
                    <Badge variant="secondary">{results.length} found</Badge>
                  </div>

                  {results.map((result, idx) => {
                    const info = CONDITION_INFO[result.type];
                    const plan = treatments[result.type];
                    const isExpanded = expandedCondition === result.type;
                    return (
                      <motion.div
                        key={result.type}
                        layout
                        data-ocid={`scan.results.item.${idx + 1}`}
                        className={`rounded-2xl border-2 overflow-hidden transition-colors ${
                          isExpanded
                            ? "border-primary/40 shadow-warm"
                            : "border-border hover:border-primary/20"
                        } bg-card`}
                      >
                        <button
                          type="button"
                          className="w-full p-4 flex items-start gap-3 text-left"
                          onClick={() =>
                            setExpandedCondition(
                              isExpanded ? null : result.type,
                            )
                          }
                          data-ocid={`scan.results.toggle.${idx + 1}`}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-serif font-semibold text-base">
                                {info.label}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${confidenceColor(result.confidence)}`}
                              >
                                {result.confidence}% confidence
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {info.description}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <Separator />
                              <div className="p-4 pt-5">
                                <TreatmentPanel
                                  conditionLabel={info.label}
                                  plan={plan}
                                  patientName={patientName}
                                  dataOcidPrefix={`scan.${result.type}`}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
