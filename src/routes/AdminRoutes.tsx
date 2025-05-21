
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Admin Pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminOrders from "@/pages/AdminOrders";
import AdminOrderDetail from "@/pages/AdminOrderDetail";
import AdminPlans from "@/pages/AdminPlans";
import AdminPlanDetail from "@/pages/AdminPlanDetail";
import NewPlanPage from "@/pages/NewPlanPage";
import AdminCredentials from "@/pages/AdminCredentials";
import AdminCookies from "@/pages/AdminCookies";
import AdminCoupons from "@/pages/AdminCoupons";
import AdminPlatforms from "@/pages/AdminPlatforms";
import AdminUsers from "@/pages/AdminUsers";
import AdminTutorials from "@/pages/AdminTutorials";
import AdminMobileTutorials from "@/pages/AdminMobileTutorials";
import AdminNotifications from "@/pages/AdminNotifications";

// Define a function that returns all the admin routes
const AdminRoutes = () => {
  return (
    [
      <Route key="admin" path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminDashboard />
        </ProtectedRoute>
      } />,
      <Route key="admin-orders" path="/admin/orders" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminOrders />
        </ProtectedRoute>
      } />,
      <Route key="admin-order-detail" path="/admin/orders/:id" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminOrderDetail />
        </ProtectedRoute>
      } />,
      <Route key="admin-plans" path="/admin/plans" element={
        <ProtectedRoute adminManagerOnly>
          <AdminPlans />
        </ProtectedRoute>
      } />,
      <Route key="admin-new-plan" path="/admin/plans/new" element={
        <ProtectedRoute adminManagerOnly>
          <NewPlanPage />
        </ProtectedRoute>
      } />,
      <Route key="admin-plan-detail" path="/admin/plans/:id" element={
        <ProtectedRoute adminManagerOnly>
          <AdminPlanDetail />
        </ProtectedRoute>
      } />,
      <Route key="admin-platforms" path="/admin/platforms" element={
        <ProtectedRoute adminManagerOnly>
          <AdminPlatforms />
        </ProtectedRoute>
      } />,
      <Route key="admin-credentials-with-plan" path="/admin/credentials/:planId" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminCredentials />
        </ProtectedRoute>
      } />,
      <Route key="admin-credentials" path="/admin/credentials" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminCredentials />
        </ProtectedRoute>
      } />,
      <Route key="admin-cookies-with-plan" path="/admin/cookies/:planId" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminCookies />
        </ProtectedRoute>
      } />,
      <Route key="admin-cookies" path="/admin/cookies" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminCookies />
        </ProtectedRoute>
      } />,
      <Route key="admin-coupons" path="/admin/coupons" element={
        <ProtectedRoute adminManagerOnly>
          <AdminCoupons />
        </ProtectedRoute>
      } />,
      <Route key="admin-coupons-by-plan" path="/admin/coupons/plan/:planId" element={
        <ProtectedRoute adminManagerOnly>
          <AdminCoupons />
        </ProtectedRoute>
      } />,
      <Route key="admin-users" path="/admin/users" element={
        <ProtectedRoute adminManagerOnly>
          <AdminUsers />
        </ProtectedRoute>
      } />,
      <Route key="admin-tutorials" path="/admin/tutorials" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminTutorials />
        </ProtectedRoute>
      } />,
      <Route key="admin-mobile-tutorials" path="/admin/mobile-tutorials" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminMobileTutorials />
        </ProtectedRoute>
      } />,
      <Route key="admin-notifications" path="/admin/notifications" element={
        <ProtectedRoute adminManagerSupportOnly>
          <AdminNotifications />
        </ProtectedRoute>
      } />
    ]
  );
};

export default AdminRoutes;
