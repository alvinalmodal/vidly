const express = require('express');
const Joi = require('joi');
const router = express.Router();

let genres = [
    {id:1,name:'action'},
    {id:2,name:'comedy'},
    {id:3,name:'romance'}
];

let validateGenre = function(genre){
    let errors = [];
    let schema = Joi.object({
        id:Joi.number().min(1).required(),
        name:Joi.string().min(3).required()
    });

    let {error} = schema.validate(genre);
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
}

router.get('/',(req,res) => {
    return res.send(genres);
});

router.get('/:id',(req,res) => {
    return res.send(genres.find( genre => genre.id === parseInt(req.params.id)));
});

router.post('/',(req,res) => {

    let genre = {
        id: genres.length + 1,
        name: req.body.name
    };

    let errors = validateGenre(genre);
    if(errors.length > 0){
        return res.status(400).send(errors);
    }

    genres.push(genre);
    return res.status(200).send(genres);
});

router.put('/:id',(req,res) => {

    let updateGenre = {
        id:req.params.id,
        name:req.body.name,
    };

    genre = genres.find( genre => genre.id === parseInt(req.params.id) );

    if(!genre)
    {
        return res.status(404).send('Invalid genre id.');
    }

    let errors = validateGenre(updateGenre);
    if(errors.length > 0){
        return res.status(400).send(errors);
    }

    genre.name = updateGenre.name;

    return res.status(200).send(genres);
});

router.delete('/:id',(req,res) => {


    let genre =  genres.find( genre => genre.id === parseInt(req.params.id));

    if(!genre)
    {
        return res.status(404).send('Invalid genre id.');
    }

    genres.splice(genres.indexOf(genre),1);

    return res.status(200).send(genres);
});

module.exports = router;
