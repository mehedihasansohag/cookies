
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import SignupHeader from "@/components/auth/SignupHeader";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (name: string, email: string, password: string, confirmPassword: string) => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await signup(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup initiated");
  };

  const handleMicrosoftSignup = () => {
    console.log("Microsoft signup initiated");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <SignupHeader />
          <SignupForm 
            onSubmit={handleSubmit}
            onGoogleSignup={handleGoogleSignup}
            onMicrosoftSignup={handleMicrosoftSignup}
            isSubmitting={isSubmitting}
            error={error}
          />
        </Card>
      </div>
    </div>
  );
};

export default Signup;
