
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Package className="h-6 w-6 text-brand-600 mr-2" />
              <span className="text-xl font-bold">Master Tools BD</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium digital subscriptions that give you access to the best online learning platforms.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Plans
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Email: support@mastertoolsbd.com
              </li>
              <li className="text-sm text-muted-foreground">
                Phone: +880 1878-720467
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8">
          <p className="text-sm text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} Master Tools BD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
