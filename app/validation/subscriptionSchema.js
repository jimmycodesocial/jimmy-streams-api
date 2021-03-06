/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import Joi from 'joi';

/**
 * Schema definition for endpoint:
 * POST /streams/:id/subscriptions
 */
export default Joi.object().keys({
  // Id of the stream. In most scenarios this can be the ID of an object.
  stream: Joi.string().required(),

  // When is specified as true, the stream subscribed (field: stream)
  // might receive notifications from the stream subscribed to (parameter :id).
  notify: Joi.boolean().default(true)
});
