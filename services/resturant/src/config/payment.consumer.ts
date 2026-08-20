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
      const order = await Order.findOneAndUpdate(
        {
          _id: orderId,
          paymentStatus: { $ne: 'paid' },
        },
        {
          $set: {
            paymentStatus: 'paid',
            status: 'placed',
          },
          $unset: {
            expiresAt: 1,
          },
        },
        { new: true }
      );
      if (!order) {
        channel.ack(msz);
        return;
      }
      console.log('order placed from rabbitmq consumer', order._id);
      //socket work

      channel.ack(msz);
    } catch (error) {
      console.error('payment consumer error', error);
    }
  });
};
