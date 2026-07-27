export const publishPaymentSuccess = async (payload: {
  orderId: string;
  paymentId: string;
  provider: 'razorpay' | 'stripe';
}) => {};
