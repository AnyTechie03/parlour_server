const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    profileImg:{
        type:String,
    },
    phoneNo:{
        type:String,
        require:true
    },
    acccount_status:{
        type:String,
        default:"unverified"
    },
    activeTime:[{
        type:Number,
        default:1
    }],
    role:{
        type:String,
    },
    location: {
        streetName: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
})

const User = mongoose.model("User",UserSchema);
module.exports = User