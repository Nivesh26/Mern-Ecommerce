import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    userEmail: {
      type: String,
      trim: true,
      default: '',
    },
    itemCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true, collection: 'cart' }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
