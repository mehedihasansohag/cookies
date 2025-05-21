
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CookieForm from '@/components/admin/cookies/CookieForm';
import CookieList from '@/components/admin/cookies/CookieList';
import { useAdminCookies } from '@/hooks/useAdminCookies';
import { PlanSelector } from '@/components/admin/plans/PlanSelector';
import { Card, CardContent } from '@/components/ui/card';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminCookies = () => {
  const { user, isAdmin, isManager, isSupport } = useAuth();
  const navigate = useNavigate();
  
  const {
    cookies,
    plans,
    isEditing,
    currentCookie,
    selectedPlanId,
    currentPlanName,
    handleDeleteCookie,
    handleEditCookie,
    handleSaveCookie,
    handleCancelEdit,
    handleTogglePinned
  } = useAdminCookies();
  
  const [filterPlanId, setFilterPlanId] = useState<string>('');
  
  // Never filter cookies at the hook level - always get all cookies
  // This ensures we always have all cookies available when filter changes
  const filteredCookies = filterPlanId 
    ? cookies.filter(cookie => cookie.planId === filterPlanId)
    : cookies; // Show all cookies when no filter
    
  // Get count per plan for summary
  const cookiesByPlan = plans.map(plan => {
    const count = cookies.filter(cookie => cookie.planId === plan.id).length;
    return { plan, count };
  }).filter(item => item.count > 0);
  
  // Admin check
  useEffect(() => {
    if (!user || (!isAdmin && !isManager && !isSupport)) {
      navigate('/login');
    }
  }, [user, isAdmin, isManager, isSupport, navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Manage Cookies</h1>
        <p className="text-gray-600">
          Add and manage cookies for your plans
        </p>
      </div>
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div>
          {/* Plan Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <PlanSelector 
                plans={plans}
                selectedPlanId={filterPlanId}
                onPlanChange={setFilterPlanId}
              />
            </CardContent>
          </Card>
          
          {/* Cookie Form */}
          <CookieForm
            isEditing={isEditing}
            currentCookie={currentCookie}
            selectedPlanId={selectedPlanId}
            plans={plans}
            onSave={handleSaveCookie}
            onCancel={handleCancelEdit}
          />
          
          {/* Plan Cookies Summary */}
          {cookiesByPlan.length > 0 && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-3">Cookies Per Plan</h3>
                <div className="space-y-2">
                  {cookiesByPlan.map(({plan, count}) => (
                    <div key={plan.id} className="flex justify-between text-sm">
                      <span>{plan.name}</span>
                      <span className="font-medium">{count} cookies</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Cookies List */}
        <div className="lg:col-span-2">
          <CookieList
            cookies={filteredCookies}
            plans={plans}
            planName={filterPlanId ? plans.find(p => p._id === filterPlanId)?.name : undefined}
            onEdit={handleEditCookie}
            onDelete={handleDeleteCookie}
            onTogglePinned={handleTogglePinned}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminCookies;
