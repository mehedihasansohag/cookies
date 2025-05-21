
import { Package } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LoginHeader = () => {
  return (
    <CardHeader className="space-y-1 flex flex-col items-center">
      <div className="flex items-center mb-2">
        <Package className="h-6 w-6 text-brand-600 mr-2" />
        <span className="text-xl font-bold">Master Tools BD</span>
      </div>
      <CardTitle className="text-2xl font-bold text-center">Login to your account</CardTitle>
      <CardDescription className="text-center">
        Enter your email and password to access your account
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
