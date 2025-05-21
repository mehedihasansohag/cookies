
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";

interface AuthButtonsProps {
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

const AuthButtons = ({ isMobile = false, onMobileItemClick }: AuthButtonsProps) => {
  const { user } = useAuth();

  if (isMobile) {
    return (
      <div className="pt-2 border-t">
        {user ? (
          <div className="flex flex-col space-y-2">
            <div className="px-2 py-1 text-sm font-medium">
              Signed in as: {user.name}
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                user && onMobileItemClick && onMobileItemClick();
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Link to="/login" onClick={onMobileItemClick}>
              <Button variant="outline" className="w-full">Login</Button>
            </Link>
            <Link to="/signup" onClick={onMobileItemClick}>
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <UserMenu />
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
