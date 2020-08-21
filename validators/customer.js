const Joi = require('joi');

let validateCustomer = function(customer){
    let errors = [];
    let schema = Joi.object({
        name:Joi.string().min(2).max(70).required(),
        isGold:Joi.boolean().required(),
        phone:Joi.string().min(9).required()
    });

    let {error} = schema.validate(customer,{abortEarly:false});
    if(error){
        errors = error.details.map( error => {
            return {key:error.context.key,message:error.message};
        });
    }
    return errors;
};

module.exports = validateCustomer;