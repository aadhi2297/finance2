// models/TransactionModel.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: "" },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  transactionType: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
