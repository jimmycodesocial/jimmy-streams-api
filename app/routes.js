'use strict';

/* global require */

let router = require('express').Router();
let streams = require('./controllers/streams');
let subscriptions = require('./controllers/subscriptions');
let activities = require('./controllers/activities');

/**
 * This endpoint represents a collection of activities
 * performed by the stream itself or others streams subscribed to.
 *
 * @api {post} /streams Create new streams
 * @apiGroup Streams
 * @apiName createStream
 */
router.post('/streams', streams.create);

// Subscriptions Collection
// Subscribe the stream to another stream
router.post('/streams/:name/subscriptions', subscriptions.create);

// Get the list of subscriptions from the stream
router.get('/streams/:name/subscriptions', subscriptions.get);

// Modify how a stream is subscribed to another stream
router.put('/streams/:name/subscriptions/:stream', subscriptions.put);

// Remove the subscription existing between two streams
router.delete('/streams/:name/subscriptions/:stream', subscriptions.delete);

/**
 * This endpoint registers activities and spread them through the different streams.
 * The activities are sent to a queue, for fast response, and then analyzed.
 *
 * @api {post} /activities Receive new activities
 * @apiGroup Activities
 * @apiName createActivity
 */
router.post('/activities', activities.create);

// Get the list of activities that were saved in the stream
router.get('/streams/:name/activities', activities.get);

module.exports = router;
