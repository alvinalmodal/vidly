const bcrypt = require('bcrypt');

async function hash(value){
    const saltRounds = await bcrypt.genSalt(parseInt(process.env.SALT));
    const hashedValue = await bcrypt.hash(value,saltRounds);
    return hashedValue;
}

module.exports.hash = hash;