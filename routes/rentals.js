const _ = require('lodash');
const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const router = express.Router();

let validateRental = function(rental){

    let errors = [];
    let schema = Joi.object({
        movies:Joi.array().items(
            Joi.object().keys({
                _id:Joi.objectId().required()
            })
        ).min(1).required(),
        customer:Joi.object().keys({
            _id:Joi.objectId().required()
        }).required()
    });

    let {error} = schema.validate(rental,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
}


router.get('/',async (req,res,next) =>{
    try {
        const rentals = await Rental.find();
        return res.send(rentals);
    } catch (error) {
        next(error);
    }
    
});

router.get('/:id',async (req,res,next) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if(!rental)
        {
            return res.status(404).send('Invalid rental id');
        }
        return res.send(rental);
    } catch (error) {
        next(error);
    }
})

router.post('/',async (req,res,next) => {
    try {

        const errors = validateRental(req.body);
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }

        // check if id of the movies are valid.
        const movies = await Movie.find({_id:{$in:req.body.movies}});
        if(movies.length !== req.body.movies.length)
        {
            const invalidMovies = _.difference(
                req.body.movies.map(value => value._id),
                movies.map(value => value._id.toString())
            );
            return res.status(404).send({key:'movies._id',message:'List of _id provided contains an invalid movie',values:invalidMovies});
        }

        const customer = await Customer.findById(req.body.customer._id);
        if(!customer)
        {
            return res.status(404).send('Invalid customer id.');
        }

        let discount = 0;
        if(customer.isGold)
        {
            discount = 10;
        }

        let totalRentalRate = 0;
        movies.forEach( value => {
            totalRentalRate += value.dailyRentalRate;
        });

        let rental = new Rental({
            movies: movies.map( value => {
                return {_id:value._id,title:value.title};
            }),
            customer: _.pick(customer,['_id','name','phone','isGold']),
            rentalDate: Date.now(),
            discount,
            totalRentalRate: totalRentalRate - discount
        });
        rental = await rental.save();

        return res.send(rental);

    } catch (error) {
        next(error);
    }
    
});

module.exports = router;