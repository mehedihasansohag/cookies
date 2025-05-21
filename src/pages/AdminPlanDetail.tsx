
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminPlanDetail } from '@/hooks/useAdminPlanDetail';
import PlanForm from '@/components/admin/plans/PlanForm';
import PlanManagementSidebar from '@/components/admin/plans/PlanManagementSidebar';
import PlanDetailHeader from '@/components/admin/plans/PlanDetailHeader';
import PlanDetailLoading from '@/components/admin/plans/PlanDetailLoading';
import PlanNotFound from '@/components/admin/plans/PlanNotFound';
import { useData } from '@/contexts/DataContext';

const AdminPlanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const { platforms } = useData();
  
  const {
    isLoading,
    plan,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    selectedPlatforms,
    togglePlatform,
    stickerText,
    setStickerText,
    stickerColor,
    setStickerColor,
    durationType,
    handleDurationTypeChange,
    durationValue,
    setDurationValue,
    handleSave,
    isSaving
  } = useAdminPlanDetail(id);
  
  // Handle authentication
  if (!user || (!isAdmin && !isManager)) {
    navigate('/login');
    return null;
  }
  
  // Loading state
  if (isLoading) {
    return <PlanDetailLoading navigateBack={() => navigate('/admin/plans')} />;
  }
  
  // Not found state
  if (!plan) {
    return <PlanNotFound navigateBack={() => navigate('/admin/plans')} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <PlanDetailHeader 
        planName={plan.name} 
        navigateBack={() => navigate('/admin/plans')} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2">
          <PlanForm
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            selectedPlatforms={selectedPlatforms}
            togglePlatform={togglePlatform}
            platforms={platforms}
            stickerText={stickerText}
            setStickerText={setStickerText}
            stickerColor={stickerColor}
            setStickerColor={setStickerColor}
            durationType={durationType}
            handleDurationTypeChange={handleDurationTypeChange}
            durationValue={durationValue}
            setDurationValue={setDurationValue}
            handleSave={handleSave}
            isSaving={isSaving}
          />
        </div>
        
        {/* Sidebar */}
        <div>
          <PlanManagementSidebar 
            planId={id || ''} 
            navigate={navigate} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPlanDetail;
