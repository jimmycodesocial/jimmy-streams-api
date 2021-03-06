/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import config from 'config';
import async from 'async';
import {createStreams, createSubscription} from '../graph';
let logger = config.get('app').logger;

/**
 * Accept an activity for processing.
 *
 * @param {object}   activity The activity
 * @param {function} done     Callback to notify
 */
export const processStreams = (activity, done) => {
  logger.debug('Processing activity', {activity: activity});

  // Extract the important streams.
  // There will be always actor and object.
  let streams = [
    {id: activity.actor.id},
    {id: activity.object.id}
  ];

  // Target is optional.
  if (activity.target) {
    streams.push({id: activity.target.id});
  }

  // Make sure that all streams and subscriptions exist.
  return createStreams(streams, (err) => {
    // Error creating the streams.
    if (err) {
      logger.error('Error creating streams', {streams: streams, error: err});
      return done(err);
    }

    // Connect actor with object and target.
    // Make the connection including notification.
    let conditions = {notify: true};

    // Connect actor with object
    let subscriptions = [
      next => {createSubscription(streams[0], streams[1], conditions, next)}
    ];

    // Connect actor with target if target is present in the activity.
    if (streams.length > 2) {
      subscriptions.push(next => {createSubscription(streams[0], streams[2], conditions, next)});
    }

    // Make the subscriptions.
    return async.parallel(subscriptions, (err) => {
      if (err) {
        logger.error('Error creating subscriptions', {error: err})
      }

      return done(err);
    });
  });
};

/**
 * Expose API
 */
export default {
  processStreams: processStreams
};
