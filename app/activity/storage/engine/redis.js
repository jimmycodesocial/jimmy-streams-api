/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

/**
 * Redis client
 * @type {RedisClient}
 */
let redis = null;

/**
 * Set a connected redis client
 *
 * @param {RedisClient} client Redis client for communication
 * @param {function}    done   Callback to notify
 */
export const setClient = (client, done) => {
  redis = client;

  return done(null);
};

/**
 * Search activities with pagination.
 *
 * @param {string}   stream  Search activities from this stream
 * @param {integer}  page    Pagination
 * @param {integer}  limit   How many activities per page?
 * @param {object}   filters Ignored. This storage does not support filtering.
 * @param {function} done    Callback to notify results
 * @returns {*}
 */
export const paginate = (stream, page, limit, filters, done) => {
  page = page || 1;
  limit = limit || 25;

  let startAt = (page - 1) * limit;
  let stopAt = startAt + limit - 1;

  return redis.zrevrange(stream, startAt, stopAt, (err, results) => {
    return done(err, results);
  })
};

/**
 * Expose API
 */
export default {
  setClient: setClient,
  paginate: paginate
};
