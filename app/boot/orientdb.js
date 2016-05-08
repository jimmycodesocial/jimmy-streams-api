/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';
const Graph = require('./../packages/graph');
const async = require('async');
const _ = require('lodash');

/**
 * Connect to OrientDb.
 *
 * @param {object}   config Configuration.
 * @param {object}   logger Logger instance to log operations.
 * @param {function} done   Callback to notify the result.
 */
export const boot = (config, logger, done) => {
  logger.debug('Boot orientdb connections');
  Graph.connect(config, (err) => {
    if (err) {
      logger.error('Error connecting to orientdb', {error: err.message || ''});
    }
    else {
      logger.info('Connected to orientdb');
    }
    done(err)
  });
};

export default boot;
