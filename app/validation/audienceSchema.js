/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import Joi from 'joi';

/**
 * @see: http://activitystrea.ms/specs/json/targeting/1.0/#properties
 */
export default Joi.object().keys({
  id: Joi.string().required(),
  objectType: Joi.string().required()
}).unknown();
