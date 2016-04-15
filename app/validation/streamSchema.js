'use strict';

/* global require, module */

let Joi = require('joi');

module.exports = Joi.object().keys({
  'name': Joi.string().required(),
  'class': Joi.string().required()
});