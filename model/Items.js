const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    expDate:{
        type:Date,
    },
    inStock:{
        type:Number,
    },
    Brand:{
        type:String,
    },
    alertValue:{
        type:Number,
    },

})

const Items = mongoose.model("Item",ItemsSchema);
module.exports = Items