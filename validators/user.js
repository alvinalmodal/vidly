const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let validateUser = function(user){

    let errors = [];
    let schema = Joi.object({
        name:Joi.string().min(2).max(70).required(),
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

let validateUserRole = function(userRole){

    let errors = [];
    let schema = Joi.object({
        user:Joi.objectId().required(),
        roles:Joi.array().items(
            Joi.object().keys({
                _id:Joi.objectId().required()
            })
        ).min(1).required()
    });

    let {error} = schema.validate(userRole,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
}

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

module.exports.validateUser = validateUser;
module.exports.validateUserRole = validateUserRole;
module.exports.validateCredential = validateCredential;