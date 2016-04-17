'use strict';

import config from 'config';
import Serializer from 'jaysonapi';
let base_url = config.app.base_url;

/**
 * JSONAPI Serializer for Streams
 * @see: http://jsonapi.org/format/#document-structure
 */
export const StreamSerializer = Serializer('stream', {
  attributes: ['name', 'class'],
  links: {
    self: data => base_url + 'streams/' + data.name
  }
});

export default StreamSerializer;
