const {mongoDbUrl} = require('../config');
const winston = require('winston');
require('winston-mongodb');
const logger = new (winston.createLogger)({
    defaultMeta: { service: 'user-service' },
    transports: [
        new(winston.transports.MongoDB)({
            db : mongoDbUrl,
            collection: 'logs'
        })
        ]
});

module.exports = function(error, req, res, next){
    // log exception
    const metadata = {
        url:req.url,
        method:req.method,
        ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        stackTrace: new Error(error.message).stack
    };
    logger.log('error', error.message,{metadata});
    res.status(500).send(error.message);
}