const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { User } = require('../models/user');
const { Role } = require('../models/role');
const { hash } = require('../helpers/hash');
const { jwtSecret } = require('../config');
const router = express.Router();

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

router.get('/',async (req,res) =>{
    try {
        const users = await User.find().select({_id:1,name:1,email:1});
        return res.send(users);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.get('/:id',async (req,res) => {
    try {
        const user = await User.findById(req.params.id).select({_id:1,name:1,email:1});
        if(!user)
        {
            return res.status(404).send('Invalid user id.');
        }
        return res.send(user);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.post('/login',async (req,res) => {
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
        },
            jwtSecret
        );

        res.header('x-auth-token',token);

        return res.redirect('/api/v1/users');

    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.post('/role',async (req,res) => {

    const errors = validateUserRole(req.body);
    if(errors.length > 0)
    {
        return res.status(400).send(errors);
    }

    const user = await User.findById(req.body.user);
    if(!user)
    {
        return res.status(404).send('Invalid user id.');
    }

    // check if id of the permissions are valid.
    const roles = await Role.find({_id:{$in:req.body.roles}});
    if(roles.length !== req.body.roles.length)
    {
        const invalidRoles = _.difference(
            req.body.roles.map(value => value._id),
            roles.map(value => value._id.toString())
        );
        return res.status(404).send({key:'permissions._id',message:'List of _id provided contains an invalid permission',values:invalidRoles});
    }

    user.roles = roles;

    await user.save();

    return res.send(user);
});

router.post('/',async (req,res) => {
    try {
        const user = _.pick(req.body,['name','email','password']);
        const errors = validateUser(user);
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }

        const users = await User.findOne({email:user.email});
        if(users)
        {
            return res.status(400).send('Email is already registered to another account.');
        }

        const newUser = new User({
            name:user.name,
            email:user.email,
            password: await hash(user.password)
        });

        await newUser.save();

        return res.send(_.pick(newUser,['_id','name','email']));

    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.put('/:id',async (req,res) => {
    try {

        const errors = validateUser(req.body);
        if(errors.length > 0)
        {
            return res.status(400).send(errors);
        }

        const existingUser = await User.findOne({email:req.body.email,_id:{$ne:req.params.id}});

        if(existingUser)
        {
            return res.status(400).send('Email is already registered to another account.');
        }

        const user = await User.findById(req.params.id);

        if(!user)
        {
            return res.status(404).send('Invalid user id.');
        }

        user.name = req.body.name;
        user.email = req.body.email;
        user.password = await hash(req.body.password);

        await user.save();

        return res.send(_.pick(user,['_id','name','email']));

    } catch (error) {
        return res.status(400).send(error.message);
    }
 });

 router.delete('/:id',async (req,res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id).select({_id:1,name:1,email:1});
        if(!user)
        {
            return res.status(404).send('Invalid user id.');
        }
        return res.send(user);
    } catch (error) {
        return res.status(400).send(error.message);
    }
 });

module.exports = router;