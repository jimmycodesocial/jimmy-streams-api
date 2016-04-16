'use strict';

/* global require, module */

let config = require('config');
let aws = require('aws-sdk');
let sqsConfig = config.get('sqs');
let sqs = new aws.SQS(sqsConfig);

/**
 * Send an activity to the pool. This case a SQS queue.
 *
 * @param activity The Activity
 * @param done     Callback to notify the delivery result
 */
module.exports.sendActivity = (activity, done) => {
  var sqsParams = {
    QueueUrl: sqsConfig.QueueUrl,
    MessageBody: JSON.stringify(activity)
  };

  // Provide a custom call back to notify only with error status
  // and isolate the rest of parameters.
  return sqs.sendMessage(sqsParams, (err) => {
    return done(err);
  });
};