'use strict';

/* global require, module */

let logger = require('config').get('app').logger;
let Joi = require('joi');
let subscriptionSchema = require('../validation/subscriptionSchema');
let joiErrorSchemaToJsonApi = require('../formatter/joiErrorSchemaToJsonApi');

/**
 * Subscribe the stream to another stream
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.create = (req, res, next) => {
  logger.info('Receive new subscription', {subscription: req.body});

  // Validate json
  Joi.validate(req.body, subscriptionSchema, (err, value) => {
    if (err) {
      let errors = joiErrorSchemaToJsonApi(err);
      logger.warn('Validation error', {'errors': errors});

      // Format the output to be JSON-API compatible
      // @see: http://jsonapi.org/format/#errors
      return res.status(400).json({
        status: 400,
        code: 'E_SUBSCRIPTION_VALIDATION',
        title: 'Validation error',
        details: 'The subscription cannot take place due to validation errors.',
        meta: {
          errors: errors
        }
      });
    }

    return res.status(201).json({});
  });
};

/**
 * Get the list of subscriptions from the stream
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.get = (req, res, next) => {
  return res.send('TODO:');
};

/**
 * Modify how a stream is subscribed to another stream
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.put = (req, res, next) => {
  return res.send('TODO:');
};

/**
 * Remove the subscription existing between two streams
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.delete = (req, res, next) => {
  return res.send('TODO:');
};
