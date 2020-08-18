const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let validateCredential = function(user){

    let errors = [];
    let schema = Joi.object({
        email:Joi.string().max(255).email().required(),
        password:Joi.string().max(255).required()
    });

    let {error} = schema.validate(user,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
}

module.exports = validateCredential;