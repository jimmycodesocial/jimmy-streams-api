'use strict';
/* global module, require */

const Joi = require('joi');

const VertexPropertySchema = Joi.object().pattern(/^[$A-Z_][0-9A-Z_$]*$/i, Joi.object().keys({
  type: Joi.string().required(),
  index: Joi.string().default(null)
}));

const VertexClassSchema = Joi.object().pattern(/^[$A-Z_][0-9A-Z_$]*$/i, VertexPropertySchema);

class Schema {
  constructor(structure) {
    this.structure = structure;
    this.schemaValidator = VertexClassSchema;
    this.errors = null;
  }

  validate(obj) {
    let validator = this.schemaValidator.validate(obj);
    this.errors = validator.error;

    return validator.error == null;
  }
}

module.exports = Schema;

