'use strict';
/* global module, require */

const SchemaValidator = require('validate');

class Schema {
  constructor(structure) {
    this.structure = structure;
    // this.validator = new SchemaValidator(structure);
  }
  
  validate(obj) {
    // return this.validator.validate(obj, this.structure);
    return true;
  }
}

module.exports = Schema;

