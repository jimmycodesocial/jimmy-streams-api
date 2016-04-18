'use strict';

/* global module */

import winston from 'winston';

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    })
  ]
});

module.exports = {
  // API config
  app: {
    // Base URL for resources
    baseUrl: 'http://localhost:5000/api/',

    // Listen on this port
    port: process.env.PORT || 5000,

    // CORS rules
    // @see: https://www.npmjs.com/package/cors
    cors: {},

    // Use default configuration
    // @see: https://www.npmjs.com/package/winston
    logger: logger,

    // Pagination limits
    defaultLimit: 25,
    maxLimit: 500
  },

  // SQS Pool: send activities to this queue system
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property
  sqs: {
    // AWS access key ID
    accessKeyId: '<accessKeyId>',
    // AWS secret access key
    secretAccessKey: '<secretAccessKey>',
    // The region to send service requests to
    region: '<region>',
    // A String in YYYY-MM-DD format (or a date) that represents the latest possible API version
    // that can be used in all services (unless overridden by apiVersions).
    // Specify 'latest' to use the latest possible version.
    apiVersion: '2012-11-05',
    // Whether to enable SSL for requests.
    sslEnabled: true,
    // The URL for the created Amazon SQS queue.
    QueueUrl: '<QueueUrl>',
    // The time in seconds that the delivery of all messages in the queue will be delayed.
    // An integer from 0 to 900 (15 minutes). The default for this attribute is 0 (zero).
    DelaySeconds: 0
  },

  // OrientJS configuration
  // @see: https://github.com/orientechnologies/orientjs
  orientdb: {
    server: {
      host: '127.0.0.1',
      port: 2424,
      username: '<username>',
      password: '<password>',
      servers: [
        {host: '127.0.0.1', port: 2425}
      ]
    },
    db: {
      name: 'JimmyStreams',
      username: '<username>',
      password: '<password>'
    }
  },

  // Redis configuration
  // @see: https://www.npmjs.com/package/redis
  redis: {
    host: '127.0.0.1',
    port: 6379,
    options: {
      db: 0
    },
    auth: ''
  },

  // MongoDB configuration
  // @see: http://mongodb.github.io/node-mongodb-native/
  mongodb: {
    // Default local connection without authentication
    dsn: 'mongodb://127.0.0.1:27017/jimmystreams'
    // Use the following DNS for authentication
    // @notice: Replace 127.0.0.1 for the real host
    // dsn: 'mongodb://<user>:<password>@127.0.0.1:27017/jimmystreams'
  }
};
