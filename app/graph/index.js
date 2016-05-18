/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import config from 'config';
import async from 'async';
const Stream = require('./../models/Stream');

let logger = config.get('app').logger;

/**
 * Create a node representing the stream.
 * Information about the node is in parameter data.
 *
 * @param {object} data Information to create the node.
 * {
 *   name: string, Name of the stream. In most scenarios this can be the ID of an object.
 *   type: string  Type of stream. This field helps to identify and organize your streams.
 * }
 * @param {function} done Callback to notify when the node is created.
 */
export const createStream = (data, done) => {
  logger.debug('Creating stream', {stream: data});

  // Update or Insert the Stream in the database
  Stream.collection.upsert(data, data, done);

};

/**
 * Multiple creation nodes representing streams.
 * @see: createStream
 *
 * @param {array}    streams The list fo streams.
 * [
 *   {
 *     name: string, Name of the stream.
 *     type: string  Type of stream.
 *   }
 * ]
 * @param {function} done    Callback to notify when the streams are created.
 */
export const createStreams = (streams, done) => {
  logger.debug('Creating multiple streams');

  // Parallel iterating over each stream data
  async.each(streams, createStream, done);
};

/**
 * Remove the node representing the stream.
 *
 * @param {string}   id The stream.
 * @param {function} done Callback to notify when the node is removed.
 */
export const removeStream = (id, done) => {
  logger.debug('Removing stream', {stream: id});
  Stream.collection.delete({'id': id}, done);
};

const createStreamFinder = (stream) => {
  let criteria = null;

  if (typeof (stream) === 'object') {
    criteria = {id: stream.id};

  } else if (typeof (stream) === 'string'){
    criteria = {id: stream};
    stream = criteria;
  }

  return function (callback){
    Stream.collection.upsert(criteria, stream, callback);
  }
};

/**
 * Subscribe a stream to another stream.
 *
 * @param {string|object} fromStream This is the stream interested in subscription.
 * @param {string|object} toStream   This is the stream to whom subscribes.
 * @param {object}        conditions Subscription conditions.
 * {
 *   notify: bool: The stream subscribed might receive notifications from the stream to whom subscribes.
 * }
 * @param {function} done Callback to notify when the subscription is made.
 *
 * @notice: For stream params, if its type is string then only the name is specified,
 *          if the type is an object then the format is: {name: string, type: string}.
 */
export const createSubscription = (fromStream, toStream, conditions, done) => {
  let data = conditions || {notify: true};
  logger.debug('Creating subscription', {from: fromStream, to: toStream, data: data});

  let finders = [createStreamFinder(fromStream), createStreamFinder(toStream)];

  async.parallel(finders, (err, results)=> {
    if (err) {
      return done(err);
    }

    Stream.collection.upsertEdge('SUBSCRIBED_TO', results[0].rid, results[1].rid, data, done);
  });
};

/**
 * This method returns the list of streams subscribed to a particular stream.
 *
 * @param {string|object} fromStream The stream.
 * @param {object}        filters    Filter by type of stream or conditions.
 * {
 *   notify: bool   Only to the streams subscribed with notification.
 * }
 * @param {number}        page       Paginate the results by pages.
 * @param {number}        limit      How many results should a page have?
 * @param {function}      done       Callback to notify with the results.
 */
export const getSubscriptions = (fromStream, filters, page, limit, done) => {
  filters = filters || {};
  page = page || 1;
  limit = limit || 50;

  let qb = Stream.collection.getQueryBuilder();
  qb.select(`findSubscriptions('${fromStream}', '${filters.notify}', ${limit * (page - 1)}, ${limit}) AS subscriptions`).fetch({ "*": 1 }).all().then((results) => {
    async.map(results[0].subscriptions, (item, callback) => callback(null, {id: item.id}), done);
  });
};

/**
 * Remove the subscription between two streams.
 * That means an stream is not longer interested in the stream to which is currently subscribed.
 *
 * @param {string|object} fromStream    This is the stream subscribed.
 * @param {string|object} toStream      This is the stream to whom subscribes.
 * @param {function}      done          Callback to notify when the subscription is removed.
 *
 * @notice: For stream params, if its type is string then only the name is specified,
 *          if the type is an object then the format is: {name: string, type: string}.
 */
export const removeSubscription = (fromStream, toStream, done) => {
  logger.debug('Removing subscription', {from: fromStream, stream: toStream});

  let finders = [createStreamFinder(fromStream), createStreamFinder(toStream)];

  async.parallel(finders, (err, results)=> {
    if (err) {
      return done(err);
    }

    console.log(results);
    Stream.collection.deleteEdge(results[0].rid, results[1].rid, (err, count) => {console.log(err, count); done(err, count)});
  });
};

/**
 * Expose API
 */
export default {
  createStream: createStream,
  createStreams: createStreams,
  removeStream: removeStream,
  createSubscription: createSubscription,
  getSubscriptions: getSubscriptions,
  removeSubscription: removeSubscription
}
