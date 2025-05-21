
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/hooks/useData';
import { toast } from '@/components/ui/sonner';
import { Credential as DataCredential, Cookie as DataCookie } from '@/types/dataTypes';
import { Credential, Cookie } from '@/types/access';

interface AccessDataResult {
  isLoading: boolean;
  order: any;
  plan: any;
  credentials: Credential[];
  cookies: Cookie[];
}

/**
 * Custom hook to fetch and manage access data for a specific plan
 */
export const useAccessData = (planId: string | undefined): AccessDataResult => {
  const { user } = useAuth();
  const { getUserOrders, getPlanById, getCredentialsForPlan, getCookiesForPlan } = useData();
  // const {}
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccessData = async () => {
      if (!user || !planId) {
        navigate('/dashboard');
        return;
      }

      try {
        setIsLoading(true);
        // Check if user has an approved order for this plan
        const userOrders = await getUserOrders(user.id);
        const approvedOrder = userOrders.find(
          order => order.planId === planId && order.status === 'approved'
        );

        if (!approvedOrder) {
          toast.error("You don't have access to this plan");
          navigate('/dashboard');
          return;
        }

        // Get plan details
        const planDetails = getPlanById(planId);
        if (!planDetails) {
          toast.error("Plan not found");
          navigate('/dashboard');
          return;
        }

        // Get credentials for this plan and map to expected format
        const planCredentials = await getCredentialsForPlan(planId);
        const mappedCredentials = planCredentials.map((cred: DataCredential): Credential => ({
          id: cred.id,
          platform: cred.platform || cred.platformId,
          username: cred.username || cred.email || '',
          password: cred.password || '',
          planId: cred.planId,
          domain: cred.domain,
          updatedAt: cred.updatedAt
        }));
        
        // Get cookies for this plan and map to expected format
        const planCookies = await getCookiesForPlan(planId);
        
        // Map cookies to expected format
        const mappedCookies = planCookies.map((cookie: DataCookie): Cookie => ({
          id: cookie.id,
          platform: cookie.platform || cookie.platformId || '',
          domain: cookie.domain,
          cookieData: cookie.cookieData || JSON.stringify(cookie.value),
          updatedAt: cookie.updatedAt || new Date().toISOString(),
          planId: cookie.planId
        }));

        // Sort credentials by updatedAt in descending order (newest first)
        const sortedCredentials = mappedCredentials.sort((a, b) => {
          if (!a.updatedAt) return 1;
          if (!b.updatedAt) return -1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        setOrder(approvedOrder);
        setPlan(planDetails);
        setCredentials(sortedCredentials);
        setCookies(mappedCookies);
      } catch (error) {
        console.error('Error fetching access data:', error);
        toast.error('Failed to load access data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccessData();
  }, [user, planId, getUserOrders, getPlanById, getCredentialsForPlan, getCookiesForPlan, navigate]);

  return {
    isLoading,
    order,
    plan,
    credentials,
    cookies
  };
};
