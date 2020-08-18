const Joi = require('joi');

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

module.exports = validateGenre;