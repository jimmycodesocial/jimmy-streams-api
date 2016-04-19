'use strict';

import config from 'config';
import async from 'async';
import {default as fastEngine} from './engine/redis';
import {default as historicalEngine} from './engine/mongodb';
let logger = config.app.logger;

/**
 * Paginate results from the fast storage engine.
 *
 * @param {string}   stream  Stream where the search takes place.
 * @param {integer}  page    Pagination
 * @param {integer}  limit   How many activities per page?
 * @param {object}   filters Restrict the results by applying these filters.
 * @param {function} done    Callback to notify results.
 */
const paginateFastEngine = (stream, page, limit, filters, done) => {
  // Search the activities in memory/fast storage
  return fastEngine.paginate(stream, page, limit, filters, (err, results) => {
    if (err) {
      logger.error('Error searching activities from fast engine', {
        error: err.message || '',
        stream: stream,
        page: page,
        limit: limit,
        filters: filters
      });
    }

    return done(err, results || []);
  });
};

/**
 * Paginate results from the historical/slow storage engine.
 *
 * @param {string}   stream  Stream where the search takes place.
 * @param {integer}  page    Pagination
 * @param {integer}  limit   How many activities per page?
 * @param {object}   filters Restrict the results by applying these filters.
 * @param {function} done    Callback to notify results.
 */
const paginateHistoricalEngine = (stream, page, limit, filters, done) => {
  // Search the results in the historical storage
  return historicalEngine.paginate(stream, page, limit, filters, (err, results) => {
    if (err) {
      logger.error('Error searching activities from historical engine', {
        error: err.message || '',
        stream: stream,
        page: page,
        limit: limit,
        filters: filters
      });
    }

    return done(err, results || []);
  });
};

/**
 * Storage proxy to connect fast and historical engines in the search of activities.
 *
 * @param {string}   stream  Stream where the search takes place.
 * @param {integer}  page    Pagination
 * @param {integer}  limit   How many activities per page?
 * @param {object}   filters Restrict the results by applying these filters.
 * @param {function} done    Callback to notify results.
 */
export const paginate = (stream, page, limit, filters, done) => {
  // Normalize
  filters = filters || {};

  // Don't request the fast storage when a filter is applied.
  // The fast storage does not support filtering.
  if (Object.keys(filters).length != 0) {
    return paginateHistoricalEngine(stream, page, limit, filters, done);
  }

  // Is a pagination without filters.
  // Search the activities in memory/fast storage
  async.waterfall([
    // First look into the fast storage.
    next => {paginateFastEngine(stream, page, limit, filters, next);},

    // Accept the results or look into the historical storage.
    (results, next) => {
      // If we found the same amount of results requested,
      // return the results without searching in other engine.
      if (results.length === limit) {
        return next(null, results);
      }

      logger.warn('Results not found in fast storage engine', {
        stream: stream,
        page: page,
        limit: limit,
        filters: filters
      });

      return paginateHistoricalEngine(stream, page, limit, filters, next);
    }
  ], (err, results) => {
    done(err, results || []);
  });
};

/**
 * Expose API
 */
export default {
  paginate: paginate
}
