const bcrypt = require('bcrypt');
const { salt } = require('config');

async function hash(value){
    return bcrypt.hash(value,await bcrypt.genSalt(salt));
}

module.exports.hash = hash;