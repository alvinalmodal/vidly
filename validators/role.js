const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let validateRole = function(role){

    let errors = [];
    let schema = Joi.object({
        name:Joi.string().required()
    });

    let {error} = schema.validate(role,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;

}

module.exports = validateRole;