'use strict';

/* global require, module */

let Joi = require('joi');

/**
 * @see: http://activitystrea.ms/specs/json/1.0/#activity
 */
module.exports = Joi.object().keys({
  published: Joi.date().iso().required(),
  actor: Joi.object().keys({
    id: Joi.string().required(),
    objectType: Joi.string().required()
  }).with('id', 'objectType'),
  verb: Joi.string().required()
}).without('target', 'to');
