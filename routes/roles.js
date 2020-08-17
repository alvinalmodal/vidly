const _ = require('lodash');
const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { Role } = require('../models/role');
const router = express.Router();

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


router.get('/',async (req,res,next) =>{
    try {
        const roles = await Role.find();
        return res.send(roles);
    } catch (error) {
        next(error);
    }
    
});

router.get('/:id',async (req,res,next) => {
    try {
        const role = await Role.findById(req.params.id);
        if(!role)
        {
            return res.status(404).send('Invalid role id');
        }
        return res.send(role);
    } catch (error) {
        next(error);
    }
});

router.post('/',async (req,res,next) => {
    try {
        
        const errors = validateRole(_.pick(req.body,['name']));
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }

        const existingRole = await Role.findOne({name:req.body.name});
        if(existingRole)
        {
            return res.status(400).send('Role already exists.');
        }

        const role = new Role({
            name:req.body.name
        });

        await role.save();

        return res.send(role);

    } catch (error) {
        next(error);
    }
});

router.put('/:id',async (req,res,next) => {
    try {
        
        const errors = validateRole(_.pick(req.body,['name']));
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }

        const role = await Role.findById(req.params.id);

        if(!role)
        {
            return res.status(400).send('Invalid role id.');
        }

        role.name = req.body.name;

        role.save();

        return res.send(role);

    } catch (error) {
        next(error);
    }
});

router.delete('/:id',async (req,res,next) => {
    try {
        const role = await Role.findByIdAndRemove(req.params.id);
        return res.send(role);
    } catch (error) {
        next(error);
    }
});

module.exports = router;