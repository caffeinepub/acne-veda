import { Alert, AlertDescription } from "@/components/ui/alert";
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

export function TreatmentPanel({
  conditionLabel,
  plan,
  dataOcidPrefix,
}: TreatmentPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-xl font-semibold text-foreground">
        Treatment Plan for{" "}
        <span className="text-primary">{conditionLabel}</span>
      </h3>

      <Tabs defaultValue="medicines" data-ocid={`${dataOcidPrefix}.tab`}>
        <TabsList className="grid grid-cols-4 w-full h-auto gap-1 bg-muted/50 p-1">
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
            {/* Herbal Wash — shown for all cases */}
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
      </Tabs>
    </div>
  );
}
