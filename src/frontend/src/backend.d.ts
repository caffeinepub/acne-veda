export type PasswordHash = string;

export interface backendInterface {
  registerUser: (username: string, passwordHash: PasswordHash) => Promise<void>;
  login: (username: string, passwordHash: PasswordHash) => Promise<void>;
  addAssessmentHistory: (username: string) => Promise<void>;
  hasHistory: (username: string) => Promise<boolean>;
}
