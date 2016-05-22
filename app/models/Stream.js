'use strict';
/* global require, module */

import * as Graph from './../packages/graph';

const streamSchema = Graph.Schema({
  id: {
    type: 'string',
    index: 'UNIQUE_HASH_INDEX'
  }
});

export default Graph.Vertex('Stream', streamSchema);
