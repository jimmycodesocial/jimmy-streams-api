'use strict';

import config from 'config';
import async from 'async';
let logger = config.get('app').logger;

/**
 * Create a node representing the stream.
 * Information about the node is in parameter data.
 *
 * @param {object} data Information to create the node.
 * {
 *   name: string,  Name of the stream. In most scenarios this can be the ID of an object.
 *   class: string  Type of stream. This field helps to identify and organize your streams.
 * }
 * @param {function} done Callback to notify when the node is created.
 */
export const createStream = (data, done) => {
  logger.debug('Creating stream', {stream: data});

  // TODO: Empty implementation
  done(null);
};

/**
 * Multiple creation nodes representing streams.
 * @see: createStream
 *
 * @param {array}    streams The list fo streams.
 * [
 *   {
 *     name: string, Name of the stream.
 *     class: string Type of stream.
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
 * @param {string}   name The stream.
 * @param {function} done Callback to notify when the node is removed.
 */
export const removeStream = (name, done) => {
  logger.debug('Removing stream', {stream: name});

  done(null);
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
 *          if the type is an object then the format is: {name: string, class: string}.
 */
export const createSubscription = (fromStream, toStream, conditions, done) => {
  conditions = conditions || {notify: true};
  logger.debug('Creating subscription', {from: fromStream, to: toStream, conditions: conditions});

  // TODO: Empty implementation
  done(null);
};

/**
 * This method returns the list of streams subscribed to a particular stream.
 *
 * @param {string|object} fromStream The stream.
 * @param {object}        filters    Filter by type of stream or conditions.
 * {
 *   class: string Filter the streams by its class. If it is not specified, all types of stream will be searched.
 *   notify: bool  Only to the streams subscribed with notification.
 * }
 * @param {number}        page       Paginate the results by pages.
 * @param {number}        limit      How many results should a page have?
 * @param {function}      done       Callback to notify with the results.
 */
export const getSubscriptions = (fromStream, filters, page, limit, done) => {
  filters = filters || {};
  page = page || 1;
  limit = limit || 50;

  // TODO: Empty implementation
  done(null, []);
};

/**
 * Modify the terms of subscription between two streams.
 *
 * @param {string|object} fromStream This is the stream subscribed.
 * @param {string|object} toStream   This is the stream to whom subscribes.
 * @param {object}        conditions Subscription conditions.
 * {
 *   notify: bool: The stream subscribed might receive notifications from the stream to whom subscribes.
 * }
 * @param {function}      done       Callback to notify when the subscription is modified.
 *
 * @notice: For stream params, if its type is string then only the name is specified,
 *          if the type is an object then the format is: {name: string, class: string}.
 */
export const updateSubscriptionStatus = (fromStream, toStream, conditions, done) => {
  conditions = conditions || {notify: true};
  logger.debug('Update subscription', {from: fromStream, to: toStream, conditions: conditions});

  // TODO: Empty implementation
  done(null);
};

/**
 * Remove the subscription between two streams.
 * That means an stream is not longer interested in the stream to which is currently subscribed.
 *
 * @param {string|object} fromStream    This is the stream subscribed.
 * @param {string|object} removeStream  This is the stream to whom subscribes.
 * @param {function}      done          Callback to notify when the subscription is removed.
 *
 * @notice: For stream params, if its type is string then only the name is specified,
 *          if the type is an object then the format is: {name: string, class: string}.
 */
export const removeSubscription = (fromStream, removeStream, done) => {
  logger.debug('Removing subscription', {from: fromStream, stream: removeStream});

  // TODO: Empty implementation
  done(null);
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
  updateSubscriptionStatus: updateSubscriptionStatus,
  removeSubscription: removeSubscription
}
