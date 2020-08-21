const express = require('express');
const {Genre} = require('./../models/genre');
const validateGenre = require('../validators/genre');
const validateId = require('../middleware/validateId');
const router = express.Router();

router.get('/',async function(req,res,next){
    try {
        let genre = await Genre.find().select({_id:1,name:1});
        return res.send(genre);
    } catch (error) {
        next(error);
    }

});

router.get('/:id', validateId, async function (req,res,next){
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

router.put('/:id',validateId,async function(req,res,next){
    try {
        let id = req.params.id;

        let genre = {
            name:req.body.name,
        };

        const updatedGenre = await Genre.findById(req.params.id);
        if(!updatedGenre)
        {
            return res.status(404).send('Invalid genre id.');
        }
    
        let errors = validateGenre(genre);
        if(errors.length > 0){
            return res.status(400).send(errors);
        }
        
        updatedGenre.name = req.body.name;
        await updatedGenre.save();

        return res.status(200).send(updatedGenre);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id',validateId ,async function(req,res,next){
    try {
        const genre = await Genre.findById(req.params.id);
        if(!genre){
            res.status(404).send('Invalid genre id.');
        }

        await Genre.findOneAndRemove({_id:genre._id});
        return res.status(200).send(genre);
    } catch (error) {
        next(error);
    }

});

module.exports = router;
