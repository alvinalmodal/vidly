const {mongoDbUrl} = require('../config');
const winston = require('winston');
require('winston-mongodb');
const mongoDbLogger = new (winston.createLogger)({
    defaultMeta: { service: 'user-service' },
    transports: [
        new(winston.transports.MongoDB)({
            db : mongoDbUrl,
            collection: 'logs'
        })
        ]
});

const log = function(logType,message,metadata)
{
    mongoDbLogger.log(logType,message,{metadata});
}

module.exports = log;