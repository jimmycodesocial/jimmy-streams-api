/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import Joi from 'joi';
import config from 'config';
import {default as subscriptionSchema} from '../validation/subscriptionSchema';
import {default as joiErrorSchemaToJsonApi} from './../jsonApi/formatter/joiErrorSchemaToJsonApi';
import {createSubscription, getSubscriptions, removeSubscription} from '../graph';
let logger = config.get('app').logger;

/**
 * Subscribe the stream to another stream.
 *
 * @param req
 * @param res
 */
export const create = (req, res) => {
  logger.info('Receive new subscription', {subscription: req.body});

  // Validate json.
  Joi.validate(req.body, subscriptionSchema, (err, value) => {
    if (err) {
      let errors = joiErrorSchemaToJsonApi(err);
      logger.warn('Validation error', {'errors': errors});

      // Format the output to be JSON-API compatible.
      // @see: http://jsonapi.org/format/#errors
      return res.status(400).json({
        status: 400,
        code: 'E_SUBSCRIPTION_VALIDATION',
        title: 'Validation error',
        detail: 'The subscription cannot take place due to validation errors.',
        meta: {
          errors: errors
        }
      });
    }

    // Subscribe with notification by default.
    let conditions = {notify: value.notify || true};

    return createSubscription(value.stream, req.params.name, conditions, (err) => {
      // An error occurred creating the subscription.
      if (err) {
        // Format the output to be JSON-API compatible.
        // @see: http://jsonapi.org/format/#errors
        return res.status(500).json({
          status: 500,
          code: 'E_SUBSCRIPTION_CREATION',
          title: 'Error creating the subscription',
          detail: 'The subscription was not created due to internal errors.',
          meta: {
            error: err.message || 'no message'
          }
        });
      }

      // Subscription created successfully.
      return res.status(201).json({});
    });
  });
};

/**
 * Get the list of subscriptions from the stream
 *
 * @param req
 * @param res
 */
export const get = (req, res) => {
  // TODO: Empty implementation
  return res.status(200).json({});
};

/**
 * Modify how a stream is subscribed to another stream
 *
 * @param req
 * @param res
 */
export const put = (req, res) => {
  // TODO: Empty implementation
  return res.status(200).json({});
};

/**
 * Remove the subscription existing between two streams
 *
 * @param req
 * @param res
 */
export const remove = (req, res) => {
  // TODO: Empty implementation
  return res.status(204).json({});
};

export default {
  create: create,
  get: get,
  put: put,
  remove: remove
};
