'use strict';

/* global require, module */

let logger = require('config').get('app').logger;
let Joi = require('joi');
let activitySchemaValidation = require('../validation/activitySchema');
let joiErrorSchemaToJsonApi = require('../formatter/joiErrorSchemaToJsonApi');
let poolSQS = require('../pool/sqs');

/**
 * Receive new activities
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.create = (req, res, next) => {
  logger.info('Receive new activities', {activity: req.body});

  // Validate json
  Joi.validate(req.body, activitySchemaValidation, (err, value) => {
    if (err) {
      let errors = joiErrorSchemaToJsonApi(err);
      logger.warn('Validation error', {'errors': errors});

      // Format the output to be JSON-API compatible
      // @see: http://jsonapi.org/format/#errors
      return res.status(400).json({
        status: 400,
        code: 'E_ACTIVITY_VALIDATION',
        title: 'Validation error',
        details: 'The activity cannot be accepted due to validation errors.',
        meta: {
          errors: errors
        }
      });
    }

    // Send the activity to the pool to be analyzed
    poolSQS.sendActivity(value, (err) => {
      if (err) {
        logger.error('Error accepting an activity', { 'error': err });

        return res.status(400).json({
          status: 400,
          code: 'E_ACTIVITY_ACCEPTANCE',
          title: 'Activity not accepted',
          details: 'The activity cannot be accepted due to internal errors while sending it to the pool.'
        });
      }

      // The activity was accepted correctly
      return res.status(202).json({});
    });
  });
};

/**
 * Get the list of activities that were saved in the stream
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.get = (req, res, next) => {
  return res.send('TODO:');
};
