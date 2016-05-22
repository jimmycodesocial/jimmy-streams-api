'use strict';
/* global require, module */

import * as rieluz from 'rieluz';

const streamSchema = rieluz.Schema({
  id: {
    type: 'string',
    index: 'UNIQUE_HASH_INDEX'
  }
});

export default rieluz.Vertex('Stream', streamSchema);
