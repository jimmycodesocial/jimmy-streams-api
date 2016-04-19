'use strict';

import async from 'async';
import config from 'config';
import {default as app} from './main';
import {boot as bootRedis} from './boot/redis';
import {boot as bootMongoDb} from './boot/mongo';
import {boot as bootOrientDb} from './boot/orientdb';
import {setClient as setRedisStorageEngine} from './activity/storage/engine/redis';
import {setClient as setMongoDbStorageEngine} from './activity/storage/engine/mongodb';
let appConfig = config.app;
let logger = appConfig.logger;

logger.info('Booting ...');

let boots = [
  // Connect redis
  done => {
    bootRedis(config.redis, logger, (err, client) => {
      setRedisStorageEngine(client, done);
    })
  },

  // Connect mongodb
  done => {
    bootMongoDb(config.mongodb, logger, (err, client) => {
      setMongoDbStorageEngine(client, done);
    });
  },

  // Connect orientdb
  done => {
    bootOrientDb(config.orientdb, logger, (err, client) => {
      done(err);
    });
  }
];

// Boot services
async.parallel(boots, (err) => {
  if (err) {
    return logger.error('Error booting the services', {error: err.message || ''});
  }

  // Start listening on configured port
  let server = app.listen(appConfig.port, () => {
    let addr = server.address();
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

    logger.info('Listening on ' + bind);
    logger.info("Started application on mode " + app.get("env"));
  });
});
