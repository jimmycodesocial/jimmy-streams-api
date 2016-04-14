'use strict';

/* global require */

let router = require('express').Router();
let streams = require('./controllers/streams');
let subscriptions = require('./controllers/subscriptions');
let activities = require('./controllers/activities');

// Streams Collection
// Create new streams
router.post('streams', streams.create);

// Subscriptions Collection
// Subscribe the stream to another stream
router.post('streams/:name/subscriptions', subscriptions.create);

// Get the list of subscriptions from the stream
router.get('streams/:name/subscriptions', subscriptions.get);

// Modify how a stream is subscribed to another stream
router.put('streams/:name/subscriptions/:stream', subscriptions.put);

// Remove the subscription existing between two streams
router.delete('streams/:name/subscriptions/:stream', subscriptions.delete);

// Activities Collection
// Receive new activities
router.post('activities', activities.create);

// Get the list of activities that were saved in the stream
router.get('streams/:name/activities', activities.get);

module.exports = router;
