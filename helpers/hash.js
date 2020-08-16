const bcrypt = require('bcrypt');
const { salt } = require('../config');

async function hash(value){
    const saltRounds = await bcrypt.genSalt(parseInt(salt));
    const hashedValue = await bcrypt.hash(value,saltRounds);
    return hashedValue;
}

module.exports.hash = hash;