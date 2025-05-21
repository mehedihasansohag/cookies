
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login initiated");
  };

  const handleMicrosoftLogin = () => {
    console.log("Microsoft login initiated");
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email);
      setForgotPasswordOpen(false);
    } catch (err) {
      // Error handling is done in the forgotPassword function
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <LoginHeader />
          <LoginForm 
            onSubmit={handleSubmit}
            onForgotPasswordClick={() => setForgotPasswordOpen(true)}
            onGoogleLogin={handleGoogleLogin}
            onMicrosoftLogin={handleMicrosoftLogin}
            isSubmitting={isSubmitting}
            error={error}
          />
        </Card>
      </div>

      <ForgotPasswordDialog
        isOpen={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        onSubmit={handleForgotPassword}
      />
    </div>
  );
};

export default Login;
