'use strict';

import config from 'config';
import Serializer from 'jaysonapi';
let baseUrl = config.app.baseUrl;

/**
 * JSONAPI Serializer for Streams
 * @see: http://jsonapi.org/format/#document-structure
 */
export const StreamSerializer = Serializer('stream', {
  attributes: ['name', 'class'],
  links: {
    self: data => baseUrl + 'streams/' + data.name
  }
});

export default StreamSerializer;
