'use strict';

/* global require, module */

import config from 'config';
import aws from 'aws-sdk';
let sqsConfig = config.sqs;
let sqs = new aws.SQS(sqsConfig);
let logger = config.app.logger;

/**
 * Send an activity to the pool. This case a SQS queue.
 *
 * @param activity The Activity
 * @param done     Callback to notify the delivery result
 */
export const sendActivity = (activity, done) => {
  logger.debug('SQS Pool', {activity: activity});

  let sqsParams = {
    QueueUrl: sqsConfig.QueueUrl,
    MessageBody: JSON.stringify(activity)
  };

  // Provide a custom call back to notify only with error status
  // and isolate the rest of parameters.
  return sqs.sendMessage(sqsParams, (err) => {
    return done(err);
  });
};

/**
 * Expose API
 */
export default {
  sendActivity: sendActivity
};
