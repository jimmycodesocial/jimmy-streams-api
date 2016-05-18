/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import Joi from 'joi';
import {default as audienceSchema} from './audienceSchema';

/**
 * @see: http://activitystrea.ms/specs/json/1.0/#activity
 */
export default Joi.object().keys({
  // The date and time at which the activity was published.
  // An activity MUST contain a published property.
  published: Joi.date().iso().required(),

  // Describes the entity that performed the activity.
  // An activity MUST contain one actor property whose value is a single Object.
  actor: audienceSchema,

  // Identifies the action that the activity describes.
  // An activity SHOULD contain a verb property whose value is a JSON String that is non-empty.
  verb: Joi.string().required(),

  // Describes the primary object of the activity.
  // An activity SHOULD contain an object property whose value is a single Object.
  object: audienceSchema,

  // Describes the target of the activity.
  // The precise meaning of the activity's target is dependent on the activities verb,
  // but will often be the object the English preposition "to".
  // An activity MAY contain a target property whose value is a single Object.
  target: audienceSchema
}).unknown();
