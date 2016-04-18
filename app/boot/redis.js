'use strict';

import redis from 'redis';

/**
 * Connect to redis.
 *
 * @param {object}   config Configuration.
 * @param {object}   logger Logger instance to log operations.
 * @param {function} done   Callback to notify the result.
 */
export const boot = (config, logger, done) => {
  logger.debug('Boot redis...');

  let client = redis.createClient(config.port, config.host, config.options);

  client.on('error', (err) => {
    logger.error('Error with connection to redis', {error: err.message || ''});
  });

  client.on('ready', () => {
    logger.info('Connected to redis');
  });

  client.on('reconnecting', () => {
    logger.warn('Reconnecting to redis');
  });

  if (config.auth && config.auth.toString().length > 0) {
    return client.auth(config.auth, (err) => {
      if (err) {
        logger.error('Error authenticating redis');
      }
      
      return done(err, client);
    });
  }
  else {
    return done(null, client);
  }
};

export default boot;
