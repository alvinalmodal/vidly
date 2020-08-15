const mongoose = require('mongoose');
const config = require('config');
const { string, boolean } = require('joi');
const customerModelDebugger = require('debug')('app:customerModel');

mongoose.connect(config.get('customer.server'),{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> {
    customerModelDebugger("Successfully connected to the database.");
})
.catch(() => {
    customerModelDebugger("Failed to connect to database.");
});

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