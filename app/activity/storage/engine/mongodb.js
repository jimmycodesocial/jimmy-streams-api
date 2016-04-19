/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

/**
 * MongoDb client
 * @type {MongoClient}
 */
let mongodb = null;

/**
 * Set a connected mongodb client.
 *
 * @param {MongoClient} client MongoDb Client
 * @param {function}    done   Callback function to notify
 */
export const setClient = (client, done) => {
  mongodb = client;

  return done(null);
};

/**
 * Search activities with pagination.
 *
 * @param {string}   stream  Search activities from this stream
 * @param {integer}  page    Pagination
 * @param {integer}  limit   How many activities per page?
 * @param {object}   filters Filter the query.
 * @param {function} done    Callback to notify results
 */
export const paginate = (stream, page, limit, filters, done) => {
  page = page || 1;
  limit = limit || 25;
  filters = filters || {};

  let startAt = (page - 1) * limit;
  let collection = mongodb.collection('activities');

  return collection.find({stream: stream})
    .skip(startAt)
    .limit(limit)
    .toArray((err, results) => {
      return done(err, results);
  });
};

/**
 * Expose API
 */
export default {
  setClient: setClient,
  paginate: paginate
};
