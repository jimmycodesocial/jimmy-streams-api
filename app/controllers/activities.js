'use strict';

/* global require, module */

let Joi = require('joi');
let activitySchemaValidation = require('../validation/activityValidation');
let joiErrorSchemaToJsonApi = require('../formatter/joiErrorSchemaToJsonApi');

/**
 * Receive new activities
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.create = (req, res, next) => {
  // Validate json
  Joi.validate(req.body, activitySchemaValidation, (err, value) => {
    if (err) {
      // Format the output to be JSON-API compatible
      // @see: http://jsonapi.org/format/#errors
      return res.status(400).json({
        status: 400,
        code: 'E_ACTIVITY_ACCEPTANCE',
        title: 'Validation error',
        details: 'The activity cannot be accepted due to validation errors.',
        meta: {
          errors: joiErrorSchemaToJsonApi(err)
        }
      });
    }

    return res.json({'status': 'OK'});
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
