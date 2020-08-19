const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

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

module.exports = validateRental;