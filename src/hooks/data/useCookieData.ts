
import { useState } from 'react';
import { Cookie } from '@/types/dataTypes';
import cookieApi from '@/services/api/cookieApi';

export const useCookieData = () => {
  const [cookies, setCookies] = useState<Cookie[]>([]);

  // Cookie methods
  const addCookie = async (cookie: Omit<Cookie, 'id'>) => {
    try {
      const newCookie = await cookieApi.create(cookie);
      setCookies([...cookies, newCookie]);
      return newCookie;
    } catch (error) {
      console.error('Failed to add cookie:', error);
      throw error;
    }
  };

  const updateCookie = async (cookie: Cookie) => {
    try {
      const updatedCookie = await cookieApi.update(cookie.id, cookie);
      const updatedCookies = cookies.map(c => c.id === cookie.id ? updatedCookie : c);
      setCookies(updatedCookies);
      return updatedCookie;
    } catch (error) {
      console.error('Failed to update cookie:', error);
      throw error;
    }
  };

  const deleteCookie = async (id: string) => {
    try {
      await cookieApi.delete(id);
      setCookies(cookies.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete cookie:', error);
      throw error;
    }
  };

  const getCookiesForPlan = async (planId: string) => {
    try {
      const planCookies = await cookieApi.getByPlanId(planId);
      return planCookies;
    } catch (error) {
      console.error('Failed to get cookies for plan:', error);
      return [];
    }
  };

  const togglePinnedStatus = async (id: string) => {
    try {
      const updatedCookie = await cookieApi.togglePinned(id);
      const updatedCookies = cookies.map(c => c.id === id ? updatedCookie : c);
      setCookies(updatedCookies);
      return updatedCookie;
    } catch (error) {
      console.error('Failed to toggle pinned status:', error);
      throw error;
    }
  };

  return {
    cookies,
    setCookies,
    addCookie,
    updateCookie,
    deleteCookie,
    getCookiesForPlan,
    togglePinnedStatus
  };
};
