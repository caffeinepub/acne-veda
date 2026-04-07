import type { Principal } from "@icp-sdk/core/principal";

export interface ConsultationResult {
  flowType: string;
  conditionScore: bigint;
  primaryConcern: string;
  severity: string;
  doshaImbalance: string;
  rootCauses: string;
  reportJson: string;
  timestamp: bigint;
}

export interface backendInterface {
  registerUser: (username: string, passwordHash: string) => Promise<void>;
  login: (username: string, passwordHash: string) => Promise<void>;
  addAssessmentHistory: (username: string) => Promise<void>;
  hasHistory: (username: string) => Promise<boolean>;
  saveConsultationResult: (
    username: string,
    flowType: string,
    conditionScore: bigint,
    primaryConcern: string,
    severity: string,
    doshaImbalance: string,
    rootCauses: string,
    reportJson: string,
    timestamp: bigint
  ) => Promise<void>;
  getConsultationResults: (username: string) => Promise<ConsultationResult[]>;
}
