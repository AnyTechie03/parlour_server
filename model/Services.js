const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    service:{
        type:String,
    },
    duration:{
        type:Number,
    },
    productUsed:{
        type:String,
    },
    description:{
        type:String,
    },
    amount:{
        type:String,
    },
    type:{
        type:String,
    },

})

const Services = mongoose.model("Service",ServiceSchema);
module.exports = Services