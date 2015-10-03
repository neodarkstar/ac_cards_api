var winston = require('winston');

// Setup logger
var logger = new(winston.Logger)({
  transports: [
      new(winston.transports.File)({
        name: 'info-file',
        filename: 'logs/filelog-info.log',
        level: 'info'
      }),
      new(winston.transports.File)({
        name: 'error-file',
        filename: 'logs/filelog-error.log',
        level: 'error'
      })
  ]
});

module.exports = logger;
