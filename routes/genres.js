const express = require('express');
const Joi = require('joi');
const {Genre} = require('./../models/genre');
var mongoose = require('mongoose');
const router = express.Router();

let validateGenre = function(genre){
    let errors = [];
    let schema = Joi.object({
        name:Joi.string().min(3).required()
    });

    let {error} = schema.validate(genre,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
}

router.get('/',async function(req,res,next){
    try {
        let genre = await Genre.find().select({_id:1,name:1});
        return res.send(genre);
    } catch (error) {
        next(error);
    }

});

router.get('/:id',async function (req,res,next){
    try {
        let genre = await Genre.findById(req.params.id);
        return res.send(genre);
    } catch (error) {
        next(error);
    }

});

router.post('/',async function(req,res,next){

   try {
        let input = {
            name: req.body.name
        };

        let errors = validateGenre(input);
        if(errors.length > 0){
            return res.status(400).send(errors);
        }

        let genre = new Genre(input);
        
        return res.status(200).send(await genre.save());
   } catch (error) {
        next(error);
   }
});

router.put('/:id',async function(req,res,next){
    try {
        let id = req.params.id;

        let genre = {
            name:req.body.name,
        };
    
        let errors = validateGenre(genre);
        if(errors.length > 0){
            return res.status(400).send(errors);
        }
    
        const result = await Genre.findByIdAndUpdate(id,genre,{new:true});
        return res.status(200).send(result);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id',async function(req,res,next){
    try {
        const result = await Genre.findOneAndRemove(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        next(error);
    }

});

module.exports = router;
