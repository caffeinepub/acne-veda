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
    /**
     * / Record that a user has completed an assessment.
     */
    addAssessmentHistory(username: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Return all consultation results for a user (most recent 20).
     */
    getConsultationResults(username: string): Promise<Array<ConsultationResult>>;
    /**
     * / Check whether a user has completed at least one assessment.
     * / Returns false (not an error) for unknown users so new-user flows work.
     */
    hasHistory(username: string): Promise<boolean>;
    /**
     * / Authenticate a user. Returns ok on success, err on failure.
     */
    loginUser(username: string, passwordHash: PasswordHash): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Register a new user with a hashed password.
     */
    registerUser(username: string, passwordHash: PasswordHash): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Persist a consultation result and mark the user as having history.
     */
    saveConsultationResult(username: string, flowType: string, conditionScore: bigint, primaryConcern: string, severity: string, doshaImbalance: string, rootCauses: string, reportJson: string, timestamp: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
