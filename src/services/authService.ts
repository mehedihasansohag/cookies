
import { User } from '@/types/auth';
import { toast } from "@/components/ui/sonner";

export const login = async (
  users: Array<any>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  email: string, 
  password: string
): Promise<void> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }
    
    if (foundUser.blocked) {
      throw new Error('Your account has been blocked. Please contact support for assistance.');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('accessVaultUser', JSON.stringify(userWithoutPassword));
    toast.success("Logged in successfully");
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.message || 'Failed to login');
    throw error;
  }
};

export const signup = async (
  users: Array<any>,
  setUsers: React.Dispatch<React.SetStateAction<Array<any>>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  name: string, 
  email: string, 
  password: string
): Promise<void> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userExists) {
      throw new Error('Email already in use');
    }
    
    // Create new user object
    const newUser = {
      id: `${users.length + 1}`,
      email,
      name,
      password,
      role: 'user' as const,
      blocked: false
    };
    
    // Add user to the users array
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('accessVaultUser', JSON.stringify(userWithoutPassword));
    toast.success("Account created successfully");
  } catch (error: any) {
    console.error('Signup error:', error);
    toast.error(error.message || 'Failed to sign up');
    throw error;
  }
};

export const logout = (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  setUser(null);
  localStorage.removeItem('accessVaultUser');
  toast.info("Logged out");
};
