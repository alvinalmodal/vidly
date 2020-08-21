const express = require('express');
const Joi = require('joi');
const {Customer} = require('./../models/customer');
const validateCustomer = require('../validators/customer');
const router = express.Router();

router.get('/',async function(req,res,next){
    try {
        const customers = await Customer.find().sort({name:1});
        return res.send(customers);
    } catch (error) {
        next(error);
    }
});

router.get('/:id',async function(req,res,next){
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer){
            return res.status(404).send('Invalid customer id.');
        }
        return res.send(customer);
    } catch (error) {
        next(error);
    }
});

router.post('/',async function(req,res,next){
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
        next(error);
    }
});

router.put('/:id',async function(req,res,next){
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
        next(error);
    }
});

router.delete('/:id',async function(req,res,next){
    try {
        let customer = await Customer.findByIdAndRemove(req.params.id);
        return res.send(customer);
    } catch (error) {
        next(error);
    }
});

module.exports = router;