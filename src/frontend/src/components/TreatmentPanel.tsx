import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  FileDown,
  Leaf,
  Pill,
  Salad,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { TreatmentPlan } from "../data/treatmentData";

interface TreatmentPanelProps {
  conditionLabel: string;
  plan: TreatmentPlan;
  dataOcidPrefix: string;
  patientName?: string;
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  kashayam: {
    label: "Kashayam",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  churnam: {
    label: "Churnam",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  tablet: {
    label: "Tablet",
    className: "bg-green-100 text-green-800 border-green-200",
  },
};

function downloadPrescription(
  conditionLabel: string,
  plan: TreatmentPlan,
  patientName?: string,
) {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const medicinesRows = plan.internalMedicines
    .map(
      (med) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500">${med.name}<br/><span style="font-size:11px;background:#dcfce7;color:#166534;border-radius:20px;padding:1px 8px;">${med.type ? med.type.charAt(0).toUpperCase() + med.type.slice(1) : ""}</span></td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151">${med.dosage}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">${med.purpose}</td>
    </tr>`,
    )
    .join("");

  const lepaRows = plan.externalLepas
    .map(
      (lepa) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500">${lepa.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:11px">${lepa.ingredients ?? ""}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">${lepa.howToUse}</td>
    </tr>`,
    )
    .join("");

  const dietIncludeItems = plan.diet.include
    .map((item) => `<li style="margin-bottom:4px">${item}</li>`)
    .join("");
  const dietAvoidItems = plan.diet.avoid
    .map((item) => `<li style="margin-bottom:4px">${item}</li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>E-Prescription – Acne Veda</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; background: #fff; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 0; }
    .header { background: #166534; color: #fff; padding: 24px 32px; }
    .header h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { font-size: 13px; margin-top: 4px; opacity: 0.9; }
    .header .reg { font-size: 12px; margin-top: 2px; opacity: 0.75; }
    .body { padding: 28px 32px; }
    .meta { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; font-size: 13px; color: #374151; }
    .meta .label { font-weight: 600; color: #166534; }
    .rx { font-size: 32px; font-weight: 700; color: #166534; font-style: italic; margin-bottom: 12px; }
    .section-title { font-size: 14px; font-weight: 700; color: #166534; border-bottom: 2px solid #166534; padding-bottom: 4px; margin: 18px 0 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f0fdf4; color: #166534; font-weight: 600; padding: 8px 12px; text-align: left; border-bottom: 2px solid #bbf7d0; }
    .cleansing-row { display: flex; gap: 12px; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
    .cleansing-label { font-weight: 600; color: #166534; min-width: 130px; }
    .diet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 4px; }
    .diet-include { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; }
    .diet-avoid { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 12px 16px; }
    .diet-title { font-weight: 700; font-size: 13px; margin-bottom: 8px; }
    .diet-include .diet-title { color: #166534; }
    .diet-avoid .diet-title { color: #991b1b; }
    .diet-include ul { color: #15803d; font-size: 12px; padding-left: 16px; }
    .diet-avoid ul { color: #b91c1c; font-size: 12px; padding-left: 16px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px dashed #d1d5db; font-size: 11px; color: #6b7280; }
    .footer .disclaimer { font-style: italic; margin-bottom: 6px; }
    .footer .gen { font-weight: 500; color: #374151; }
    .signature-area { margin-top: 40px; text-align: right; font-size: 13px; }
    .signature-area .sig-line { border-top: 1px solid #374151; width: 180px; margin-left: auto; margin-bottom: 4px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { width: 100%; }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <h1>Acne Veda Ayurvedic Clinic</h1>
    <p>Dr. Akash Hari (BAMS) &nbsp;|&nbsp; Ayurvedic Skin Specialist</p>
    <p class="reg">Reg. No: BAMS/2024 &nbsp;|&nbsp; Specialisation: Ayurvedic Dermatology</p>
  </div>
  <div class="body">
    <div class="meta">
      <div><span class="label">Patient:</span> ${patientName || "\u2014"}</div>
      <div><span class="label">Date:</span> ${date}</div>
      <div><span class="label">Diagnosis:</span> ${conditionLabel}</div>
    </div>
    <div class="rx">&#8478;</div>

    <div class="section-title">Internal Medicines</div>
    <table>
      <thead><tr><th>Medicine</th><th>Dosage &amp; Timing</th><th>Purpose</th></tr></thead>
      <tbody>${medicinesRows}</tbody>
    </table>

    <div class="section-title">External Applications (Lepa)</div>
    <table>
      <thead><tr><th>Lepa / Application</th><th>Ingredients</th><th>How to Use</th></tr></thead>
      <tbody>${lepaRows}</tbody>
    </table>

    <div class="section-title">Cleansing Routine</div>
    <div>
      <div class="cleansing-row"><span class="cleansing-label">🌿 Herbal Wash</span><span>${plan.cleansingRoutine.herbalWash}</span></div>
      <div class="cleansing-row"><span class="cleansing-label">☀️ Morning Routine</span><span>${plan.cleansingRoutine.morning}</span></div>
      <div class="cleansing-row"><span class="cleansing-label">🌙 Evening Routine</span><span>${plan.cleansingRoutine.evening}</span></div>
      <div class="cleansing-row"><span class="cleansing-label" style="color:#991b1b">⚠️ Avoid</span><span style="color:#6b7280">${plan.cleansingRoutine.avoid}</span></div>
    </div>

    <div class="section-title">Diet Chart</div>
    <div class="diet-grid">
      <div class="diet-include">
        <p class="diet-title">✅ Foods to Include</p>
        <ul>${dietIncludeItems}</ul>
      </div>
      <div class="diet-avoid">
        <p class="diet-title">❌ Foods to Avoid</p>
        <ul>${dietAvoidItems}</ul>
      </div>
    </div>

    <div class="signature-area">
      <div class="sig-line"></div>
      <div>Dr. Akash Hari (BAMS)</div>
      <div style="font-size:11px;color:#6b7280">Ayurvedic Skin Specialist</div>
    </div>
    <div class="footer">
      <p class="disclaimer">This prescription is for Ayurvedic treatment only. Please consult your Ayurvedic physician before starting any regimen. Do not self-medicate.</p>
      <p class="gen">This is a computer-generated Ayurvedic e-prescription. | Acne Veda – Clear Skin Naturally</p>
    </div>
  </div>
</div>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
  }
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
}

export function TreatmentPanel({
  conditionLabel,
  plan,
  dataOcidPrefix,
  patientName,
}: TreatmentPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-xl font-semibold text-foreground">
        Treatment Plan for{" "}
        <span className="text-primary">{conditionLabel}</span>
      </h3>

      <Tabs defaultValue="medicines" data-ocid={`${dataOcidPrefix}.tab`}>
        <TabsList className="grid grid-cols-5 w-full h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger
            value="medicines"
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2"
          >
            <Pill className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Internal</span> Medicines
          </TabsTrigger>
          <TabsTrigger
            value="lepas"
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2"
          >
            <Leaf className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">External</span> Lepas
          </TabsTrigger>
          <TabsTrigger
            value="cleansing"
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2"
          >
            <Droplets className="w-3.5 h-3.5" />
            Cleansing
          </TabsTrigger>
          <TabsTrigger
            value="diet"
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2"
          >
            <Salad className="w-3.5 h-3.5" />
            Diet
          </TabsTrigger>
          <TabsTrigger
            value="eprescription"
            data-ocid={`${dataOcidPrefix}.eprescription.tab`}
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">E-</span>Prescription
          </TabsTrigger>
        </TabsList>

        {/* Internal Medicines */}
        <TabsContent value="medicines" className="mt-4">
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">Medicine</TableHead>
                  <TableHead className="font-semibold">Dosage</TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">
                    Purpose
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plan.internalMedicines.map((med, i) => {
                  const badge = med.type ? TYPE_BADGE[med.type] : null;
                  return (
                    <TableRow
                      key={med.name}
                      data-ocid={`${dataOcidPrefix}.medicines.item.${i + 1}`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span>{med.name}</span>
                          {badge && (
                            <span
                              className={`inline-block w-fit text-xs font-medium border rounded-full px-2 py-0.5 ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {med.dosage}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                        {med.purpose}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Alert className="mt-3 border-primary/20 bg-primary/5">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-muted-foreground">
              {plan.disclaimer}
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* External Lepas */}
        <TabsContent value="lepas" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.externalLepas.map((lepa, i) => (
              <div
                key={lepa.name}
                data-ocid={`${dataOcidPrefix}.lepas.item.${i + 1}`}
                className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs hover:shadow-warm transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="font-serif font-semibold text-base text-foreground">
                      {lepa.name}
                    </h4>
                    {lepa.skinTypeNote && (
                      <span className="inline-block text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2 py-0.5">
                        {lepa.skinTypeNote}
                      </span>
                    )}
                  </div>
                  <Leaf className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Ingredients:
                  </span>{" "}
                  {lepa.ingredients}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    How to use:
                  </span>{" "}
                  {lepa.howToUse}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground italic">
            Tip: Avoid harsh scrubs, over-washing, or chemical products.
          </p>
        </TabsContent>

        {/* Cleansing Routine */}
        <TabsContent value="cleansing" className="mt-4">
          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1 text-emerald-800">
                  Herbal Wash — Triphala Kashayam
                </p>
                <p className="text-sm text-emerald-700">
                  {plan.cleansingRoutine.herbalWash}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-sm">☀️</span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Morning Routine</p>
                <p className="text-sm text-muted-foreground">
                  {plan.cleansingRoutine.morning}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-sm">🌙</span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Evening Routine</p>
                <p className="text-sm text-muted-foreground">
                  {plan.cleansingRoutine.evening}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3">
              <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-1">Avoid</p>
                <p className="text-sm text-muted-foreground">
                  {plan.cleansingRoutine.avoid}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Diet */}
        <TabsContent value="diet" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-800">Include</p>
              </div>
              <ul className="space-y-2">
                {plan.diet.include.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-green-700">
                    <span className="mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="font-semibold text-red-800">Avoid</p>
              </div>
              <ul className="space-y-2">
                {plan.diet.avoid.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-red-700">
                    <span className="mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* E-Prescription */}
        <TabsContent value="eprescription" className="mt-4">
          <div className="rounded-xl border border-green-200 overflow-hidden shadow-sm">
            {/* Prescription Header */}
            <div className="bg-green-700 text-white px-6 py-4">
              <h4 className="text-lg font-bold tracking-wide">
                Acne Veda Ayurvedic Clinic
              </h4>
              <p className="text-sm mt-1 opacity-90">
                Dr. Akash Hari (BAMS) &nbsp;|&nbsp; Ayurvedic Skin Specialist
              </p>
              <p className="text-xs mt-0.5 opacity-70">
                Reg. No: BAMS/2024 &nbsp;|&nbsp; Specialisation: Ayurvedic
                Dermatology
              </p>
            </div>

            {/* Prescription Body */}
            <div className="bg-white px-6 py-4 space-y-4">
              {/* Meta */}
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                {patientName && (
                  <div>
                    <span className="font-semibold text-green-700">
                      Patient:{" "}
                    </span>
                    <span className="text-gray-700">{patientName}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-green-700">Date: </span>
                  <span className="text-gray-700">
                    {new Date().toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-green-700">
                    Diagnosis:{" "}
                  </span>
                  <span className="text-gray-700">{conditionLabel}</span>
                </div>
              </div>

              {/* Rx symbol */}
              <div className="text-3xl font-bold italic text-green-700 leading-none">
                ℞
              </div>

              {/* Internal Medicines */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 border-b-2 border-green-600 pb-1 mb-2">
                  Internal Medicines
                </p>
                <div className="space-y-2">
                  {plan.internalMedicines.map((med, i) => {
                    const badge = med.type ? TYPE_BADGE[med.type] : null;
                    return (
                      <div
                        key={med.name}
                        className="flex flex-wrap items-start gap-2 text-sm py-1 border-b border-gray-100"
                      >
                        <span className="font-semibold text-gray-800 min-w-[160px]">
                          {i + 1}. {med.name}
                        </span>
                        {badge && (
                          <span
                            className={`inline-block text-xs font-medium border rounded-full px-2 py-0.5 ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        )}
                        <span className="text-gray-600 text-xs">
                          {med.dosage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* External Lepas */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 border-b-2 border-green-600 pb-1 mb-2">
                  External Applications (Lepa)
                </p>
                <div className="space-y-2">
                  {plan.externalLepas.map((lepa, i) => (
                    <div
                      key={lepa.name}
                      className="text-sm py-1 border-b border-gray-100 space-y-0.5"
                    >
                      <p className="font-semibold text-gray-800">
                        {i + 1}. {lepa.name}
                      </p>
                      {lepa.ingredients && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium text-gray-600">
                            Ingredients:
                          </span>{" "}
                          {lepa.ingredients}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-600">
                          How to use:
                        </span>{" "}
                        {lepa.howToUse}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cleansing Routine */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 border-b-2 border-green-600 pb-1 mb-2">
                  Cleansing Routine
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2 py-1 border-b border-gray-100">
                    <span className="font-semibold text-emerald-700 min-w-[130px]">
                      🌿 Herbal Wash
                    </span>
                    <span className="text-gray-600 text-xs">
                      {plan.cleansingRoutine.herbalWash}
                    </span>
                  </div>
                  <div className="flex gap-2 py-1 border-b border-gray-100">
                    <span className="font-semibold text-amber-700 min-w-[130px]">
                      ☀️ Morning
                    </span>
                    <span className="text-gray-600 text-xs">
                      {plan.cleansingRoutine.morning}
                    </span>
                  </div>
                  <div className="flex gap-2 py-1 border-b border-gray-100">
                    <span className="font-semibold text-indigo-700 min-w-[130px]">
                      🌙 Evening
                    </span>
                    <span className="text-gray-600 text-xs">
                      {plan.cleansingRoutine.evening}
                    </span>
                  </div>
                  <div className="flex gap-2 py-1 border-b border-gray-100">
                    <span className="font-semibold text-red-700 min-w-[130px]">
                      ⚠️ Avoid
                    </span>
                    <span className="text-gray-500 text-xs">
                      {plan.cleansingRoutine.avoid}
                    </span>
                  </div>
                </div>
              </div>

              {/* Diet Chart */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 border-b-2 border-green-600 pb-1 mb-3">
                  Diet Chart
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <p className="text-xs font-bold text-green-800">
                        Foods to Include
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {plan.diet.include.map((item) => (
                        <li
                          key={item}
                          className="text-xs text-green-700 flex gap-1"
                        >
                          <span className="shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      <p className="text-xs font-bold text-red-800">
                        Foods to Avoid
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {plan.diet.avoid.map((item) => (
                        <li
                          key={item}
                          className="text-xs text-red-700 flex gap-1"
                        >
                          <span className="shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="text-right mt-4 pt-2">
                <div className="inline-block">
                  <div className="border-t border-gray-400 w-44 mb-1" />
                  <p className="text-sm font-semibold text-gray-800">
                    Dr. Akash Hari (BAMS)
                  </p>
                  <p className="text-xs text-gray-500">
                    Ayurvedic Skin Specialist
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-400 border-t border-dashed border-gray-200 pt-3 mt-2 space-y-1">
                <p className="italic">
                  This prescription is for Ayurvedic treatment only. Please
                  consult your Ayurvedic physician before starting any regimen.
                  Do not self-medicate.
                </p>
                <p className="font-medium text-gray-500">
                  This is a computer-generated Ayurvedic e-prescription. | Acne
                  Veda – Clear Skin Naturally
                </p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={() =>
              downloadPrescription(conditionLabel, plan, patientName)
            }
            data-ocid={`${dataOcidPrefix}.eprescription.primary_button`}
            className="mt-4 w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Download Full Prescription
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
