const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  { 
    reviewer: {type: mongoose.Schema.Types.ObjectId, ref:"Bartender"},
    detail: { type: String},
    overall: { type: Number},
    experience: { type: Number},
    staff: { type: Number},
    value: { type: Number},
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports =  Review;
