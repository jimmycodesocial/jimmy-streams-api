'use strict';
/* global require, module */

const Graph = require('./../packages/graph');

const streamSchema = Graph.Schema({
  id: {
    type: 'string',
    index: 'UNIQUE_HASH_INDEX'
  }
});

module.exports = Graph.Vertex('Stream', streamSchema);
