
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

const UserMenu = () => {
  const { user, logout, isAdmin, isManager, isSupport } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {user.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
          Dashboard
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => window.location.href = "/admin"}>
            Admin Dashboard
          </DropdownMenuItem>
        )}
        {isManager && (
          <DropdownMenuItem onClick={() => window.location.href = "/manager"}>
            Manager Dashboard
          </DropdownMenuItem>
        )}
        {isSupport && (
          <DropdownMenuItem onClick={() => window.location.href = "/support"}>
            Support Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
