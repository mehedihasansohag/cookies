
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminPlans } from '@/hooks/useAdminPlans';
import AdminPlanCard from '@/components/admin/plans/AdminPlanCard';
import CreatePlanDialog from '@/components/admin/plans/CreatePlanDialog';
import DeletePlanDialog from '@/components/admin/plans/DeletePlanDialog';
import HomepagePlansInfo from '@/components/admin/plans/HomepagePlansInfo';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminPlans = () => {
  const { user, isAdmin, isManager } = useAuth();
  const {
    filteredPlans,
    searchQuery,
    setSearchQuery,
    homepagePlansCount,
    nextHomepageOrder,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentPlan,
    setCurrentPlan,
    platforms,
    handleCreatePlan,
    handleDeletePlan,
    toggleHomepageDisplay,
    getPlatformNames,
    formatDuration,
    navigate
  } = useAdminPlans();

  useEffect(() => {
    if (!user || (!isAdmin && !isManager)) {
      navigate('/login');
      return;
    }
  }, [user, isAdmin, isManager, navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Plans</h1>
          <p className="text-gray-600">Create, edit, and delete subscription plans</p>
        </div>
        <Button 
          className="mt-4 sm:mt-0" 
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create New Plan
        </Button>
      </div>
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      {/* Search */}
      <div className="mb-8">
        <Input
          placeholder="Search plans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {/* Homepage Plans Info */}
      <HomepagePlansInfo homepagePlansCount={homepagePlansCount} />
      
      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map(plan => {
          const platformNames = getPlatformNames(plan.platforms);
          
          return (
            <AdminPlanCard
              key={plan.id}
              plan={plan}
              platformNames={platformNames}
              formatDuration={formatDuration}
              toggleHomepageDisplay={toggleHomepageDisplay}
              onEdit={(planId) => navigate(`/admin/plans/${planId}`)}
              onDelete={(plan) => {
                setCurrentPlan(plan);
                setIsDeleteDialogOpen(true);
              }}
            />
          );
        })}
        
        {filteredPlans.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-2">No plans found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Create a Plan</Button>
          </div>
        )}
      </div>
      
      {/* Create Plan Dialog */}
      <CreatePlanDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreatePlan}
        platforms={platforms}
        homepagePlansCount={homepagePlansCount}
        nextHomepageOrder={nextHomepageOrder}
      />
      
      {/* Delete Plan Confirmation */}
      <DeletePlanDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        plan={currentPlan}
        onConfirm={handleDeletePlan}
      />
    </div>
  );
};

export default AdminPlans;
