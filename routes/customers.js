const express = require('express');
const Joi = require('joi');
const {Customer} = require('./../models/customer');
var mongoose = require('mongoose');
const router = express.Router();


let validateCustomer = function(customer){
    let errors = [];
    let schema = Joi.object({
        name:Joi.string().min(2).max(70).required(),
        isGold:Joi.boolean().required(),
        phone:Joi.string().min(9).required()
    });

    let {error} = schema.validate(customer,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
};

router.get('/',async function(req,res){
    try {
        const customers = await Customer.find().sort({name:1});
        return res.send(customers);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.get('/:id',async function(req,res){
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer){
            return res.status(404).send('Invalid customer id.');
        }
        return res.send(customer);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.post('/',async function(req,res){
    try {

        let input = req.body;

        let errors = validateCustomer(input);
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }

        let customer = new Customer(input);
        customer = await customer.save();

        return res.send(customer);

    } catch (error) {

        return res.send(error.message);

    }
});

router.put('/:id',async function(req,res){
    try {

        let customer = await Customer.findById(req.params.id);

        if(!customer)
        {
            return res.status(400).send('Invalid customer id.');
        }

        let input = req.body;

        let errors = validateCustomer(input);
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }

        customer.isGold = input.isGold;
        customer.phone = input.phone;
        customer.name = input.name;
        customer.save();

        return res.send(customer);

    } catch (error) {

        return res.status(400).send(error.message);

    }
});

router.delete('/:id',async function(req,res){
    try {
        let customer = await Customer.findByIdAndRemove(req.params.id);
        return res.send(customer);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

module.exports = router;