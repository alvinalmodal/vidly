const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let validateMovie = function(movie){
    let errors = [];
    let schema = Joi.object({
        title:Joi.string().min(3).max(500).required(),
        genre:Joi.objectId().required(),
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

module.exports = validateMovie;