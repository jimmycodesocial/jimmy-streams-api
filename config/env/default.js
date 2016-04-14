'use strict';

let winston = require('winston');

module.exports = {
  app: {
    // Listen on this port
    port: process.env.PORT || 5000,

    // CORS rules
    // @see: https://www.npmjs.com/package/cors
    cors: {},

    // Use default configuration
    // @see: https://www.npmjs.com/package/winston
    logger: winston
  }
};