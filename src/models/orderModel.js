import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
product: { type: Object, required: true },
  address: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  orderDate: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  orderStatus: { type: String, default: "Processing" },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;