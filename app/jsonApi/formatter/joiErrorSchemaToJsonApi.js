'use strict';

/**
 * Extract and format the error list in a Joi validation error
 * @see: https://github.com/hapijs/joi/blob/v8.0.5/API.md#errors
 *
 * @param schema_error joi.validate error result
 */
export default (schema_error) => {
  if (!schema_error || !schema_error.isJoi) {
    return schema_error;
  }

  let errors = {};
  schema_error.details.forEach((error) => {
    errors[error.path] = error.message;
  });

  return errors;
};