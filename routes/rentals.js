const express = require('express');
const Joi = require('joi');
const {rentalSchema,Rental} = require('../models/rental');
const {movieSchema} = require('../models/movie');
const mongoose = require('mongoose');
const router = express.Router();

let validateRental = function(rental){

    const movieJoiSchema = {
        
    }

    let errors = [];
    let schema = Joi.object({
        movies:Joi.array().items(
            Joi.object().keys({
                _id:Joi.string().required(),
                title:Joi.string().min(3).max(500).required()
            })
        ).min(1).required(),
        customer:Joi.object().keys({
            _id:Joi.string().required(),
            isGold:Joi.boolean().required(),
            name:Joi.string().min(2).max(70).required(),
            phone:Joi.string().min(6).max(50)
        }).required(),
        rentalDate:Joi.date().required(),
        returnDate:Joi.date(),
        discount:Joi.number(),
        totalRentalRate:Joi.number().required()
    });

    let {error} = schema.validate(rental,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
}


router.get('/',async (req,res) =>{
    try {
        const rentals = await Rental.find();
        return res.send(rentals);
    } catch (error) {
        return res.status(400).send(error.message);
    }
    
});

router.get('/:id',async (req,res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if(!rental)
        {
            return res.status(404).send('Invalid rental id');
        }
        return res.send(rental);
    } catch (error) {
        return res.status(400).send(error.message);
    }
})

router.post('/',async (req,res) => {

    let newRental = {
        movies:req.body.movies,
        customer:req.body.customer,
        rentalDate:req.body.rentalDate,
        returnDate:req.body.returnDate,
        discount:req.body.discount,
        totalRentalRate:req.body.totalRentalRate
    }
    let errors = validateRental(newRental);
    if(errors.length > 0)
    {
        return res.status(400).send(errors);
    }

    let rental = new Rental(newRental);
    rental = await rental.save();
    return res.send(rental);
});

module.exports = router;