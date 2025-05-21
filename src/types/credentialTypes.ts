
import { Credential } from './dataTypes';

export interface CredentialContextType {
  credentials: Credential[];
  addCredential: (credential: Omit<Credential, 'id'>) => Promise<Credential>;
  updateCredential: (credential: Credential) => Promise<Credential>;
  deleteCredential: (id: string) => Promise<void>;
  getCredentialsForPlan: (planId: string) => Promise<Credential[]>;
}
