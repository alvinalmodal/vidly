const mongoose = require('mongoose');

module.exports = function(req, res, next){
    // validate if id is a valid mongodb _id.
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid id format.');
    next();
}