const mongoose = require('../startup/db')('customer');

const customerSchema = new mongoose.Schema({
    isGold: {
        type:Boolean,
        default:false
    },
    name: {
        type:String, 
        required:true,
        minlength:2,
        maxlength:70
    },
    phone: {
        type:String,
        required:true,
        min:6,
        max:50
    }
},{strict:true});

const Customer = mongoose.model('Customer',customerSchema);

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;