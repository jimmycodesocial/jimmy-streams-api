'use strict';

/* global require, module */

let Joi = require('joi');

/**
 * Schema definition for endpoint:
 * POST /streams/:name/subscriptions
 */
module.exports = Joi.object().keys({
  // Name of the stream. In most scenarios this can be the ID of an object.
  stream: Joi.string().required(),

  // When is specified as true, the stream subscribed (field: stream)
  // might receive notifications from the stream subscribed to (parameter :name).
  notify: Joi.boolean().default(false)
});