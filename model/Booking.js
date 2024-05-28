const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    bid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    date: {
      type: Date,
    },
    timeslot: {
      type: String,
    },
    extraReq: {
      type: String,
    },
    amount: {
      type: String,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
