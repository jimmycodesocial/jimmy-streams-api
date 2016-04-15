'use strict';

/* global require, module */

let streamSchemaValidation = require('../validation/streamSchema');

/**
 * Create new streams
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.create = (req, res, next) => {
  // Validate json
  req.checkBody(streamSchemaValidation);

  // Check if errors occurred
  let errors = req.validationErrors();
  if (errors) {
    // Format the output to be JSON-API compatible
    // @see: http://jsonapi.org/format/#errors
    return res.status(400).json({
      status: 400,
      code: 'E_STREAM_CREATION',
      title: 'Validation error',
      details: 'The stream cannot be created due to validation errors.',
      meta: {
        errors: errors
      }
    });
  }

  return res.json({'status': 'OK'});
};