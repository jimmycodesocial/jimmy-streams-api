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
import {createSubscription, getSubscriptions, removeSubscription, updateSubscriptionStatus} from '../graph';
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
    let conditions = {notify: value.notify};

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
 * Get the list of subscriptions from the stream.
 *
 * @param req
 * @param res
 */
export const get = (req, res) => {
  let stream = req.params.name;
  let page = req.query.page;
  let limit = req.query.limit;
  let filters = {
    type: req.query.type,
    notify: req.query.notify
  };

  return getSubscriptions(stream, filters, page, limit, (err, streams) => {
    // Error retrieving the list of subscriptions.
    if (err) {
      // Format the output to be JSON-API compatible.
      // @see: http://jsonapi.org/format/#errors
      return res.status(500).json({
        status: 500,
        code: 'E_RETRIEVE_SUBSCRIPTIONS',
        title: 'Error retrieving the subscription list',
        detail: 'The subscription was not retrieve due to internal errors.',
        meta: {
          error: err.message || 'no message'
        }
      });
    }

    return res.status(200).json({data: streams});
  });
};


/**
 * Remove the subscription existing between two streams.
 *
 * @param req
 * @param res
 */
export const remove = (req, res) => {
  let fromStream = req.params.stream;
  let toStream = req.params.name;

  return removeSubscription(fromStream, toStream, (err) => {
    // Error removing subscription.
    if (err) {
      // Format the output to be JSON-API compatible.
      // @see: http://jsonapi.org/format/#errors
      return res.status(500).json({
        status: 500,
        code: 'E_SUBSCRIPTION_DELETION',
        title: 'Error removing the subscription',
        detail: 'The subscription was not removed due to internal errors.',
        meta: {
          error: err.message || 'no message'
        }
      });
    }

    return res.status(204).json({});
  });
};

export default {
  create: create,
  get: get,
  remove: remove
};
