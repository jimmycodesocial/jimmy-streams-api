'use strict';

/**
 * Connect to OrientDb.
 *
 * @param {object}   config Configuration.
 * @param {object}   logger Logger instance to log operations.
 * @param {function} done   Callback to notify the result.
 */
export const boot = (config, logger, done) => {
  logger.warn('Boot orientdb: Not implemented');

  return done(null, null);
};

export default boot;
