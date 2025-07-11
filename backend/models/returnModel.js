const mongoose = require("mongoose");

const ReturnSchema = new mongoose.Schema(
  {
    returnId: { type: String, required: true, unique: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    product: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    productPrice: { type: Number, required: true, min: 0 },
    totalReturnPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Returned", "Cancel"],
    },
    note: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

ReturnSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Return ID already exists. Please use a unique return ID."));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Return", ReturnSchema);