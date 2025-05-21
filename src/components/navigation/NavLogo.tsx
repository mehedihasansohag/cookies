
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const NavLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Link to="/" className="flex items-center">
        <Package className="h-6 w-6 text-brand-600 mr-2" />
        <span className="text-xl font-bold">Master Tools BD</span>
      </Link>
    </div>
  );
};

export default NavLogo;
