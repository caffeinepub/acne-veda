import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PasswordHash = string;
export interface ConsultationResult {
    conditionScore: bigint;
    flowType: string;
    reportJson: string;
    timestamp: bigint;
    rootCauses: string;
    doshaImbalance: string;
    severity: string;
    primaryConcern: string;
}
export interface backendInterface {
    addAssessmentHistory(username: string): Promise<void>;
    getConsultationResults(username: string): Promise<Array<ConsultationResult>>;
    hasHistory(username: string): Promise<boolean>;
    loginUser(username: string, passwordHash: PasswordHash): Promise<void>;
    registerUser(username: string, passwordHash: PasswordHash): Promise<void>;
    saveConsultationResult(username: string, flowType: string, conditionScore: bigint, primaryConcern: string, severity: string, doshaImbalance: string, rootCauses: string, reportJson: string, timestamp: bigint): Promise<void>;
}
