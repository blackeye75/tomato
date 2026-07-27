import { AuthenticatedRequest } from '../middleware/isAuth.js';
import TryCatch from '../middleware/tryCatch.js';
import Address from '../model/Address.js';
import Cart from '../model/Cart.js';
import Restuarant from '../model/Resturant.js';
import { IMenuItem } from '../model/MenuItems.js';
import { IRestaurant } from '../model/Resturant.js';
import Order from '../model/Order.js';

export const createOrder = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { paymentMethod, addressId, distance } = req.body;
  if (!addressId) {
    return res.status(400).json({
      message: 'Address is Required',
    });
  }
  const address = await Address.findOne({
    _id: addressId,
    userId: user._id,
  });
  if (!address) {
    return res.status(404).json({ message: 'Address not found' });
  }
  const cartItems = await Cart.find({ userId: user._id })
    .populate<{ itemId: IMenuItem }>('itemId')
    .populate<{ restaurantId: IRestaurant }>('restaurantId');
  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  const firstCartItem = cartItems[0];
  if (!firstCartItem || !firstCartItem.restaurantId) {
    return res.status(400).json({ message: 'Invalid cart data' });
  }
  const restaurantId = firstCartItem.restaurantId._id;
  const restaurant = await Restuarant.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ message: 'No Restuarant With This Id' });
  }
  if (!restaurant.isOpen) {
    return res
      .status(404)
      .json({ message: 'Sorry this restaurant is closed for now' });
  }
  let subtotal = 0;
  const orderItems = cartItems.map((cart) => {
    const item = cart.itemId;
    if (!item) {
      throw new Error('Invalid cart Item');
    }
    const itemTotal = item.price * cart.quantity;
    subtotal += itemTotal;
    return {
      itemId: item._id.toString(),
      name: item.name,
      price: item.price,
      quantity: cart.quantity,
    };
  });
  const deliveryFee = subtotal > 250 ? 0 : 49;
  const platformFee = 7;
  const totalAmount = subtotal + deliveryFee + platformFee;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const [longitude, latitude] = address.location.coordinates;
  const riderAmount = Math.ceil(distance) * 17;
  const order = await Order.create({
    userId: user._id,
    restaurantId: restaurantId.toString(),
    restaurantName: restaurant.name,
    riderId: null,
    distance,
    riderAmount,
    items: orderItems,
    subtotal,
    deliveryFee,
    platformFee: platformFee,
    totalAmount,
    addressId: address._id.toString(),
    deliveryAddress: {
      formattedAddress: address.formattedAddress,
      mobile: address.mobile,
      latitude,
      longitude,
    },
    paymentMethod,
    paymentStatus: 'pending',
    status: 'placed',
    expiresAt,
  });
  await Cart.deleteMany({ userId: user._id });
  res.json({
    message: 'Order Created Successfully',
    orderId: order._id.toString(),
    amount: totalAmount,
  });
});

export const fetchOrderForPayment = TryCatch(async (req, res) => {
  if (req.headers['x-internal-key'] !== process.env.INTERNAL_SERVICE_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order Not Found' });
  }
  if (order.paymentStatus !== 'pending') {
    return res.status(400).json({ message: 'Order Already Paid' });
  }
  res.json({ orderId: order._id, amount: order.totalAmount, currency: 'INR' });
});
