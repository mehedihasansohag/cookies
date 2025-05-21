
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/contexts/DataContext';
import { formatDate } from '@/utils/formatUtils';
import { orderService } from '@/services/orderService';
import { Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderHistoryProps {
  orders: Order[];
}

export const OrderHistory = ({ orders }: OrderHistoryProps) => {
  const isMobile = useIsMobile();
  
  if (orders.length === 0) {
    return null;
  }

  const handleDownload = (order: Order) => {
    // Create a formatted order details text
    const orderText = `
==================================================
            MASTER TOOLS BD
==================================================
          ORDER SUMMARY

Order ID: ${order.id}
Plan: ${order.planName}
Purchase Date: ${formatDate(order.date)}
Expiration Date: ${order.expirationDate ? formatDate(order.expirationDate) : 'N/A'}

Payment Details:
--------------------------------------------------
Original Price:      $${order.originalPrice.toFixed(2)}
${order.originalPrice !== order.finalPrice ? `Discount:           -$${(order.originalPrice - order.finalPrice).toFixed(2)}` : ''}
--------------------------------------------------
Final Price:         $${order.finalPrice.toFixed(2)}

Status: ${order.status.toUpperCase()}
Payment Method: **** ${order.lastFourDigits || order.paymentLastFour || ''}

==================================================
          Thank you for your order!
   For support: support@mastertoolsbd.com
==================================================
    `.trim();

    // Create and download the text file
    const blob = new Blob([orderText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master-tools-order-${order.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // For mobile view, create card-based layout for each order
  if (isMobile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>All your past orders and their status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map(order => {
            const isExpired = orderService.isOrderExpired(order);
            const discountAmount = order.originalPrice - order.finalPrice;
            
            return (
              <Card key={order.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{order.planName}</h4>
                    <Badge className={
                      order.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-500">Purchase Date:</p>
                      <p>{formatDate(order.date)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Expiration:</p>
                      <p className={isExpired ? "text-red-600 font-medium" : ""}>
                        {order.expirationDate ? formatDate(order.expirationDate) : '-'}
                        {isExpired && " (Expired)"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Original Price:</p>
                      <p>${order.originalPrice.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Final Price:</p>
                      <p className="font-medium">${order.finalPrice.toFixed(2)}</p>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Discount:</p>
                        <p className="text-green-600">
                          -${discountAmount.toFixed(2)} 
                          ({Math.round((discountAmount / order.originalPrice) * 100)}%)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownload(order)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  // Desktop view with table layout
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>All your past orders and their status</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2 font-medium">Plan</th>
              <th className="pb-2 font-medium">Purchase Date</th>
              <th className="pb-2 font-medium">Expiration Date</th>
              <th className="pb-2 font-medium">Original Price</th>
              <th className="pb-2 font-medium">Discount</th>
              <th className="pb-2 font-medium">Final Price</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const isExpired = orderService.isOrderExpired(order);
              const discountAmount = order.originalPrice - order.finalPrice;
              const discountPercentage = order.originalPrice > 0 
                ? Math.round((discountAmount / order.originalPrice) * 100) 
                : 0;
              
              return (
                <tr key={order.id} className="border-b">
                  <td className="py-3">{order.planName}</td>
                  <td className="py-3">{formatDate(order.date)}</td>
                  <td className="py-3">
                    {order.expirationDate ? (
                      <span className={isExpired ? "text-red-600 font-medium" : ""}>
                        {formatDate(order.expirationDate)}
                        {isExpired && " (Expired)"}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-3">${order.originalPrice.toFixed(2)}</td>
                  <td className="py-3">
                    {discountAmount > 0 ? (
                      <span className="text-green-600">
                        -${discountAmount.toFixed(2)}
                        <span className="text-xs ml-1">({discountPercentage}%)</span>
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-3">
                    <span className="font-medium">${order.finalPrice.toFixed(2)}</span>
                  </td>
                  <td className="py-3">
                    <Badge className={
                      order.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownload(order)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
