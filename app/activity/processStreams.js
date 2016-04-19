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
    {name: activity.actor.id, class: activity.actor.objectType},
    {name: activity.object.id, class: activity.object.objectType}
  ];

  // Target is optional.
  if (activity.target) {
    streams.push({name: activity.target.id, class: activity.target.objectType});
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
      done => {createSubscription(streams[0], streams[1], conditions, done)}
    ];

    // Connect actor with target if target is present in the activity.
    if (streams.length > 2) {
      subscriptions.push(done => {createSubscription(streams[0], streams[2], conditions, done)});
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
