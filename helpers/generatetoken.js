const jwt = require('jsonwebtoken');

const generateToken = function(user) {
    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        roles: user.roles.map(val => val.name)
    },
        process.env.JWT_SECRET
    );
    return token;
}

module.exports = generateToken;