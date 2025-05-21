
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'support' | 'user';
  blocked?: boolean;
}

export interface PasswordResetRequest {
  email: string;
  token: string;
  expires: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSupport: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  changeUserRole: (userId: string, newRole: 'admin' | 'manager' | 'support' | 'user') => Promise<void>;
  getUsers: () => User[];
  getUserById: (id: string) => User | undefined;
}
