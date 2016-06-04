/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import Joi from 'joi';
import config from 'config';
import streamSchemaValidation from '../validation/streamSchema';
import joiErrorSchemaToJsonApi from './../jsonApi/formatter/joiErrorSchemaToJsonApi';
import {createStream, removeStream} from '../graph';
import StreamSerializer from '../jsonApi/serializer/stream';
let logger = config.get('app').logger;

/**
 * Create new streams
 *
 * @param req
 * @param res
 */
export const create = (req, res) => {
  logger.info('Receive new stream', {stream: req.body});

  // Validate json
  Joi.validate(req.body, streamSchemaValidation, (err, value) => {
    if (err) {
      let errors = joiErrorSchemaToJsonApi(err);
      logger.warn('Validation error', {'errors': errors});

      // Format the output to be JSON-API compatible
      // @see: http://jsonapi.org/format/#errors
      return res.status(400).json({
        status: 400,
        code: 'E_STREAM_VALIDATION',
        title: 'Validation error',
        detail: 'The stream cannot be created due to validation errors.',
        meta: {
          errors: errors
        }
      });
    }

    // Create the stream node in the graph
    logger.debug('Create the stream node in the graph');

    return createStream(value, (err) => {
      // Error occurred while creating the node.
      if (err) {
        logger.error('Error creating the stream', {'error': err});

        // Format the output to be JSON-API compatible
        // @see: http://jsonapi.org/format/#errors
        return res.status(500).json({
          status: 500,
          code: 'E_STREAM_CREATION',
          title: 'Error creating the stream',
          detail: 'The stream cannot be created due to internal errors.',
          meta: {
            error: err.message || 'no message'
          }
        });
      }

      // Acknowledge the creation
      return res.status(201).json(StreamSerializer.serialize({
        data: value
      }));
    });
  });
};

/**
 * Remove existing streams
 *
 * @param req
 * @param res
 */
export const remove = (req, res) => {
  let stream = req.params.id;

  // Remove the node from the graph
  logger.info('Remove an stream', {stream: stream});

  return removeStream(stream, (err) => {
    if (err) {
      logger.error('Error removing the stream', {'stream': stream});
      // Format the output to be JSON-API compatible
      // @see: http://jsonapi.org/format/#errors
      return res.status(500).json({
        status: 500,
        code: 'E_STREAM_DELETION',
        title: 'Error removing the stream',
        detail: 'The stream cannot be removed due to internal errors.',
        meta: {
          error: err.message || 'no message'
        }
      });
    }

    // No representation
    return res.status(204).json({});
  });
};

/**
 * Expose controllers
 */
export default {
  create: create,
  remove: remove
}
