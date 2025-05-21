
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/dataTypes';
import { Calendar, Clock, Download } from 'lucide-react';
import { formatPlanDuration } from '@/services/orderService';

interface OrderSummaryProps {
  order: Order;
  plan: any;
  formatDate: (dateString: string) => string;
  orderUser: any;
}

export const OrderSummary = ({ order, plan, formatDate, orderUser }: OrderSummaryProps) => {
  const discountAmount = order?.originalPrice - order?.finalPrice;
  const discountPercentage = order?.originalPrice > 0 
    ? Math.round((discountAmount / order.originalPrice) * 100) 
    : 0;

  const handleDownload = () => {
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

Plan Details:
--------------------------------------------------
${plan ? `Name: ${plan.name}
Description: ${plan.description}
Duration: ${formatPlanDuration(plan)}` : 'Plan details not available'}

Customer:
--------------------------------------------------
${orderUser ? `Name: ${orderUser.name}
Email: ${orderUser.email}
User ID: ${orderUser.id}
Status: ${orderUser.blocked ? 'Blocked' : 'Active'}` : 'Customer details not available'}

Payment Details:
--------------------------------------------------
Last 4 Digits: ••••${order?.lastFourDigits || order?.paymentLastFour || ''}
${order?.couponCode ? `Coupon Applied: ${order.couponCode}` : ''}
Original Price:      $${order?.originalPrice.toFixed(2)}
${discountAmount > 0 ? `Discount (${discountPercentage}%): -$${discountAmount.toFixed(2)}` : ''}
--------------------------------------------------
Final Price:         $${order?.finalPrice.toFixed(2)}
Status: ${order?.status.toUpperCase()}

==================================================
          Thank you for your business!
   For support: admin@mastertoolsbd.com
==================================================
`.trim();

    // Create and download the text file
    const blob = new Blob([orderText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master-tools-order-summary-${order.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4" /> Order placed on {formatDate(order.date)}
            </CardDescription>
            {order.expirationDate && (
              <CardDescription className="mt-1 text-amber-600 flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Subscription expires on {formatDate(order.expirationDate)}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={
              order?.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
              order?.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
              'bg-red-100 text-red-800 border-red-200'
            }>
              {order?.status}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download Summary
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Plan</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {plan ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                  {plan.durationType && plan.durationValue && (
                    <p className="text-gray-600 text-sm mt-1">
                      Duration: {formatPlanDuration(plan)}
                    </p>
                  )}
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="font-bold">${plan.price.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <p>Plan details not available</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Payment Details</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>Last 4 Digits: ••••{order?.lastFourDigits || order?.paymentLastFour || ''}</p>
              {order?.couponCode && (
                <p className="mt-2">Coupon Applied: {order.couponCode}</p>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>Original Price:</span>
                  <span>${order?.originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount{discountPercentage > 0 ? ` (${discountPercentage}%)` : ''}:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Final Price:</span>
                  <span>${order?.finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Customer</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {orderUser ? (
                <>
                  <p><span className="font-medium">Name:</span> {orderUser.name}</p>
                  <p className="mt-1"><span className="font-medium">Email:</span> {orderUser.email}</p>
                  <p className="mt-1"><span className="font-medium">User ID:</span> {orderUser.id}</p>
                  <p className="mt-1">
                    <span className="font-medium">Status:</span> 
                    {orderUser.blocked ? (
                      <span className="text-red-600 ml-1">Blocked</span>
                    ) : (
                      <span className="text-green-600 ml-1">Active</span>
                    )}
                  </p>
                </>
              ) : (
                <p>Customer details not available</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
