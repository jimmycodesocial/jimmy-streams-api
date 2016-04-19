/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import Joi from 'joi';

export default Joi.object().keys({
  'name': Joi.string().required(),
  'type': Joi.string().required()
});
