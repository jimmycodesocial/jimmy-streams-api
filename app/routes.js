/*!
 * jimmy-streams-api
 * Copyright(c) 2016 Jimmy Code Social (http://jimmycode.com)
 * ISC Licensed
 */

'use strict';

import Router from 'express';
import {create as createStream, remove as removeStream} from './controllers/streams';
import {
  create as createSubscription,
  get as getSubscriptions,
  put as modifySubscription,
  remove as removeSubscription
} from './controllers/subscriptions';
import {create as createActivity, get as getActivities} from './controllers/activities';
let router = Router();

/**
 * This endpoint represents a collection of activities
 * performed by the stream itself or others streams subscribed to.
 *
 * @api {post} /streams Create new streams
 * @apiGroup Streams
 * @apiName createStream
 */
router.post('/streams', createStream);

/**
 * Endpoint to remove an existing stream.
 *
 * @api {delete} /streams/:id
 * @apiGroup Streams
 * @apiName removeStream
 */
router.delete('/streams/:id', removeStream);

// Subscriptions Collection
// Subscribe the stream to another stream
router.post('/streams/:id/subscriptions', createSubscription);

// Get the list of subscriptions from the stream
router.get('/streams/:id/subscriptions', getSubscriptions);

// Remove the subscription existing between two streams
router.delete('/streams/:id/subscriptions/:stream', removeSubscription);

/**
 * This endpoint registers activities and spread them through the different streams.
 * The activities are sent to a queue, for fast response, and then analyzed.
 *
 * @api {post} /activities Receive new activities
 * @apiGroup Activities
 * @apiName createActivity
 */
router.post('/activities', createActivity);

// Get the list of activities that were saved in the stream
router.get('/streams/:id/activities', getActivities);

/**
 * Expose endpoints
 */
export default router;
