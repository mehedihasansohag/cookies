
import { useState, useEffect } from 'react';
import { Order } from '@/types/dataTypes';

export const useOrdersFilter = (orders: Order[], refreshTrigger: number) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  useEffect(() => {
    let result = [...orders];
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.userName.toLowerCase().includes(query) || 
        order.planName.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery, refreshTrigger]);

  return {
    filteredOrders,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery
  };
};
