import Order from '../model/Order.js';
import { getChannel } from './rabbitmq.js';

export const startPaymentConsumer = async () => {
  const channel = getChannel();
  channel.consume(process.env.PAYMENT_QUEUE!, async (msz) => {
    if (!msz) {
      return;
    }
    try {
      const event = JSON.parse(msz.content.toString());
      if (event.type !== 'PAYMENT_SUCCESS') {
        channel.ack(msz);
        return;
      }
      const { orderId } = event.data;
      const order = Order.findOneAndUpdate({
        _id: orderId,
        paymentStatus: { $ne: 'paid' },
      });
      
    } catch (error) {}
  });
};
