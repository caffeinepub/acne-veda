import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Calendar,
  Hash,
  Home,
  Phone,
  User,
  Users,
} from "lucide-react";
import type React from "react";

export interface PatientDetails {
  name: string;
  sex: string;
  dob: string;
  age: string;
  occupation: string;
  address: string;
  contact: string;
}

interface Props {
  details: PatientDetails;
  onChange: (details: PatientDetails) => void;
}

function calculateAge(dob: string): string {
  if (!dob) return "";
  const today = new Date();
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "";
  let years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
  }
  return years >= 0 ? String(years) : "";
}

export function PatientDetailForm({ details, onChange }: Props) {
  const set =
    (field: keyof PatientDetails) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const updated = { ...details, [field]: e.target.value };
      if (field === "dob") {
        updated.age = calculateAge(e.target.value);
      }
      onChange(updated);
    };

  return (
    <div className="rounded-2xl border border-primary/20 bg-card p-5 space-y-4 shadow-sm">
      <h2 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
        <User className="w-4 h-4 text-primary" />
        Patient Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="pt-name"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-primary" /> Name
          </Label>
          <Input
            id="pt-name"
            placeholder="Patient full name"
            value={details.name}
            onChange={set("name")}
            className="border-primary/30 focus-visible:ring-primary/40"
          />
        </div>

        {/* Sex */}
        <div className="space-y-1.5">
          <Label
            htmlFor="pt-sex"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-primary" /> Sex
          </Label>
          <Select
            value={details.sex}
            onValueChange={(val) => onChange({ ...details, sex: val })}
          >
            <SelectTrigger
              id="pt-sex"
              className="border-primary/30 focus:ring-primary/40"
            >
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DOB */}
        <div className="space-y-1.5">
          <Label
            htmlFor="pt-dob"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" /> Date of Birth
          </Label>
          <Input
            id="pt-dob"
            type="date"
            value={details.dob}
            onChange={set("dob")}
            className="border-primary/30 focus-visible:ring-primary/40"
          />
        </div>

        {/* Age (auto-calculated) */}
        <div className="space-y-1.5">
          <Label
            htmlFor="pt-age"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Hash className="w-3.5 h-3.5 text-primary" /> Age
            <span className="text-xs text-muted-foreground font-normal">
              (auto)
            </span>
          </Label>
          <Input
            id="pt-age"
            placeholder="Auto-calculated from DOB"
            value={details.age}
            readOnly
            className="border-primary/30 bg-muted/40 cursor-not-allowed text-muted-foreground"
          />
        </div>

        {/* Occupation */}
        <div className="space-y-1.5">
          <Label
            htmlFor="pt-occupation"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5 text-primary" /> Occupation
          </Label>
          <Input
            id="pt-occupation"
            placeholder="e.g. Student, Teacher"
            value={details.occupation}
            onChange={set("occupation")}
            className="border-primary/30 focus-visible:ring-primary/40"
          />
        </div>

        {/* Contact */}
        <div className="space-y-1.5">
          <Label
            htmlFor="pt-contact"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-primary" /> Contact
          </Label>
          <Input
            id="pt-contact"
            type="tel"
            placeholder="Phone number"
            value={details.contact}
            onChange={set("contact")}
            className="border-primary/30 focus-visible:ring-primary/40"
          />
        </div>

        {/* Address — full width */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label
            htmlFor="pt-address"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-primary" /> Address
          </Label>
          <Textarea
            id="pt-address"
            placeholder="Street, city, state"
            value={details.address}
            onChange={set("address")}
            rows={2}
            className="border-primary/30 focus-visible:ring-primary/40 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
