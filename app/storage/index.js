'use strict';

import config from 'config';
import {default as fastEngine} from './engine/redis';
import {default as historicalEngine} from './engine/mongodb';
let logger = config.app.logger;

/**
 * Storage proxy to connect fast and historical engines in the search of activities.
 *
 * @param {string}   stream Stream where the search takes place.
 * @param {integer}  page   Pagination
 * @param {integer}  limit  How many activities per page?
 * @param {function} done   Callback to notify results.
 */
export const paginate = (stream, page, limit, done) => {
  // Search the activities in memory/fast storage
  return fastEngine.paginate(stream, page, limit, (err, results) => {
    if (err) {
      logger.error('Error searching activities from fast engine', {
        error: err.message || '',
        stream: stream,
        page: page,
        limit: limit
      });

      return done(err, []);
    }

    // If we found the same amount of results requested,
    // return the without searching in other engine.
    if (results.length === limit) {
      return done(null, results);
    }

    logger.warn('Results not found in fast storage engine', {
      stream: stream,
      page: page,
      limit: limit
    });

    // Search the results in the historical storage
    return historicalEngine.paginate(stream, page, limit, (err, results) => {
      if (err) {
        logger.error('Error searching activities from historical engine', {
          error: err.message || '',
          stream: stream,
          page: page,
          limit: limit
        });
      }

      return done(err, results || []);
    });
  });
};

/**
 * Expose API
 */
export default {
  paginate: paginate
}
