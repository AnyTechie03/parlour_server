const mongoose = require("mongoose")

const otp = new mongoose.Schema({
    uid:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    otp:{
        type:String,
        required:true
    },
    created: {
        type: Date,
        default: () => Date.now()
    },
    deadline:{
        type:Number,
        default: 3
    }
});

const Otp = mongoose.model('Otps', otp);
module.exports = Otp;