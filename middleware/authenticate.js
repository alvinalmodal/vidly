const jwt = require('jsonwebtoken');

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
            return res.status(401).send('Unauthorized.')
        }
    
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded;
            if(isValidRole(req.user.roles,allowedRoles))
            {
                next();
            }
            else{
                return res.status(403).send('Forbidden');
            }
        } catch (error) {
            next(error);
        }
    };
}

module.exports.auth = auth;