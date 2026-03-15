import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    open: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'store' }
);

const Store = mongoose.model('Store', storeSchema);
export default Store;
