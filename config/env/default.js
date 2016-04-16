'use strict';

/* global require, module */

let winston = require('winston');

module.exports = {
  // API config
  app: {
    // Listen on this port
    port: process.env.PORT || 5000,

    // CORS rules
    // @see: https://www.npmjs.com/package/cors
    cors: {},

    // Use default configuration
    // @see: https://www.npmjs.com/package/winston
    logger: winston
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
  }
};