const {jwtSecret} = require('../config');
const _ = require('lodash');
const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { hash } = require('../helpers/hash');
const router = express.Router();

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

router.post('/',async (req,res,next) => {
    try {
        const errors = validateCredential(req.body);
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }

        const user = await User.findOne({email:req.body.email});
        if(!user)
        {
            return res.status(404).send('Invalid username/password.');
        }
    
        const isValidPassword = await bcrypt.compare(req.body.password,user.password);
        if(!isValidPassword)
        {
            return res.status(401).send('Invalid username/password. by password comparison');
        }

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            roles: user.roles.map( value => value.name)
        },
            jwtSecret
        );

        return res.send({token});

    } catch (error) {
        next(error);
    }
});

module.exports = router;