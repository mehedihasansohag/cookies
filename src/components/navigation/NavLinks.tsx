
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavLinksProps {
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

const NavLinks = ({ isMobile = false, onMobileItemClick }: NavLinksProps) => {
  const { user, isAdmin, isManager, isSupport } = useAuth();
  const baseClasses = "text-sm font-medium hover:text-brand-600 transition-colors";
  const mobileClasses = "px-2 py-1";

  const handleClick = () => {
    if (isMobile && onMobileItemClick) {
      onMobileItemClick();
    }
  };

  return (
    <>
      <Link 
        to="/" 
        className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
        onClick={handleClick}
      >
        Home
      </Link>
      <Link 
        to="/plans" 
        className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
        onClick={handleClick}
      >
        Plans
      </Link>
      {user && (
        <Link 
          to="/dashboard" 
          className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
          onClick={handleClick}
        >
          Dashboard
        </Link>
      )}
      {isAdmin && (
        <Link 
          to="/admin" 
          className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
          onClick={handleClick}
        >
          Admin
        </Link>
      )}
      {isManager && (
        <Link 
          to="/manager" 
          className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
          onClick={handleClick}
        >
          Manager
        </Link>
      )}
      {isSupport && (
        <Link 
          to="/support" 
          className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
          onClick={handleClick}
        >
          Support
        </Link>
      )}
    </>
  );
};

export default NavLinks;
