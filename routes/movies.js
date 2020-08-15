const express = require('express');
const Joi = require('joi');
const {Movie} = require('./../models/movie');
const router = express.Router();

let validateMovie = function(movie){
    let errors = [];
    let schema = Joi.object({
        title:Joi.string().min(3).max(500).required(),
        genre:Joi.object().keys({
            _id:Joi.string().required(),
            name:Joi.string().required()
        }),
        numberInStock:Joi.number().min(0).required(),
        dailyRentalRate:Joi.number().min(0).required()
    });

    let {error} = schema.validate(movie,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
}

router.get('/',async function(req,res){
    try {
        return res.send(await Movie.find());
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.get('/:id',async function(req,res){
    try {
        let movie = await Movie.findById(req.params.id);
        if(!movie)
        {
            return res.status(404).send('Invalid movie id.');
        }
        return res.send(movie);
    } catch (error) {
        return res.status(404).send(error.message);
    }
});

router.post('/',async function(req,res){
    try {
        let newMovie = req.body;

        let errors = validateMovie(newMovie);
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }
    
        let movie = new Movie(newMovie);
        movie = await movie.save();
        return res.send(movie);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.put('/:id',async function(req,res){
    try {
        let updatedMovie = req.body;

        let errors = validateMovie(updatedMovie);
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }
    
        let movie = await Movie.findById(req.params.id);
        if(!movie)
        {
            return res.status(404).send('Invalid movie id.');
        }
        
        movie.title = updatedMovie.title;
        movie.genre = updatedMovie.genre;
        movie.save();

        return res.send(movie);

    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.delete('/:id',async function(req,res){
    try {
        let movie = await Movie.findOneAndRemove(req.params.id);
        if(!movie)
        {
            return res.status(404).send('Invalid movie id.');
        }
        return res.send(movie);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

module.exports = router;