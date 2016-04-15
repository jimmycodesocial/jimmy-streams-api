'use strict';

/* global require, module */

let Joi = require('joi');
let streamSchemaValidation = require('../validation/streamSchema');
let joiErrorSchemaToJsonApi = require('../formatter/joiErrorSchemaToJsonApi');

/**
 * Create new streams
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.create = (req, res, next) => {
  // Validate json
  Joi.validate(req.body, streamSchemaValidation, (err, value) => {
    if (err) {
      // Format the output to be JSON-API compatible
      // @see: http://jsonapi.org/format/#errors
      return res.status(400).json({
        status: 400,
        code: 'E_STREAM_CREATION',
        title: 'Validation error',
        details: 'The stream cannot be created due to validation errors.',
        meta: {
          errors: joiErrorSchemaToJsonApi(err)
        }
      });
    }

    return res.json({'status': 'OK'});
  });
};