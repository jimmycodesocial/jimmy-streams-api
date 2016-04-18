'use strict';

import Joi from 'joi';
import config from 'config';
import {default as activitySchemaValidation} from '../validation/activitySchema';
import {default as joiErrorSchemaToJsonApi} from './../jsonApi/formatter/joiErrorSchemaToJsonApi';
import {sendActivity} from '../pool/sqs';
import {paginate as paginateActivities} from '../storage';
let logger = config.get('app').logger;

/**
 * Receive new activities
 *
 * @param req
 * @param res
 */
export const create = (req, res) => {
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
        detail: 'The activity cannot be accepted due to validation errors.',
        meta: {
          errors: errors
        }
      });
    }

    // Send the activity to the pool to be analyzed
    sendActivity(value, (err) => {
      // Error occurred queueing the activity.
      if (err) {
        logger.error('Error accepting an activity', {'error': err});

        // Format the output to be JSON-API compatible
        // @see: http://jsonapi.org/format/#errors
        return res.status(500).json({
          status: 500,
          code: 'E_ACTIVITY_ACCEPTANCE',
          title: 'Activity not accepted',
          detail: 'The activity cannot be accepted due to internal errors while sending it to the pool.',
          meta: {
            error: err.message || 'no message'
          }
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
 */
export const get = (req, res) => {
  let stream = req.params.name;
  let page = req.query.page;
  let limit = req.query.limit;

  // List the activities with pagination
  return paginateActivities(stream, page, limit, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        code: 'E_ACTIVITY_SEARCH',
        title: 'Error searching activities',
        detail: 'The activity list cannot be retrieved due to internal errors.',
        meta: {
          error: err.message || ''
        }
      });
    }

    // Return the results
    return res.status(200).json({
      data: results,
      meta: {
        page: page,
        limit: limit
      }
    });
  });
};

export default {
  create: create,
  get: get
};
