
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoutes from "@/routes/AdminRoutes";

// Public Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import Plans from "@/pages/Plans";
import PlanDetail from "@/pages/PlanDetail";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

// User Pages
import Dashboard from "@/pages/Dashboard";
import ProfileSettings from "@/pages/ProfileSettings";
import AccessPage from "@/pages/AccessPage";

// Admin Pages
import ManagerDashboard from "@/pages/ManagerDashboard";
import SupportDashboard from "@/pages/SupportDashboard";

const AppRoutes = () => {
  // Get all admin routes
  const adminRoutes = AdminRoutes();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/plans/:id" element={<PlanDetail />} />
      
      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfileSettings />
        </ProtectedRoute>
      } />
      <Route path="/access/:planId" element={
        <ProtectedRoute>
          <AccessPage />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes - spreads the array of Route components */}
      {adminRoutes}
      
      {/* Protected Manager Route */}
      <Route path="/manager" element={
        <ProtectedRoute managerOnly>
          <ManagerDashboard />
        </ProtectedRoute>
      } />
      
      {/* Protected Support Route */}
      <Route path="/support" element={
        <ProtectedRoute supportOnly>
          <SupportDashboard />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
