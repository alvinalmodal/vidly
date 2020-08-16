const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config');

function isValidRole(userRoles,allowedRoles){
    let isValid = false;
    userRoles.forEach(value => {
        if(allowedRoles.indexOf(value) !== -1)
        {
            isValid = true;
            return;
        }
    });
    return isValid;
}

function auth(allowedRoles){
    return (req,res,next) => {

        const token = req.header('x-auth-token');
        if(!token)
        {
            return res.status(403).send('Forbidden.')
        }
    
        try {
            const decoded = jwt.verify(token,jwtSecret);
            req.user = decoded;
            if(isValidRole(req.user.roles,allowedRoles))
            {
                next();
            }
            else{
                return res.status(403).send('Forbidden');
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    };
}

module.exports.auth = auth;