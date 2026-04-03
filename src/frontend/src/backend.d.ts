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
export interface backendInterface {
    addAssessmentHistory(username: string): Promise<void>;
    hasHistory(username: string): Promise<boolean>;
    login(username: string, passwordHash: PasswordHash): Promise<void>;
    registerUser(username: string, passwordHash: PasswordHash): Promise<void>;
}
