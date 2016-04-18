'use strict';

import mongodb from 'mongodb';

/**
 * Connect to MongoDB.
 *
 * @param {object}   config Configuration.
 * @param {object}   logger Logger instance to log operations.
 * @param {function} done   Callback to notify the result.
 */
export const boot = (config, logger, done) => {
  logger.debug('Boot mongodb...');

  return mongodb.MongoClient.connect(config.dsn, (err, client) => {
    if (err) {
      logger.error('Error connecting to mongodb', {error: err.message || ''});
    }
    else {
      logger.info('Connected to mongodb');
    }

    return done(err, client);
  });
};

export default boot;
