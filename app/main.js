'use strict';

import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {default as router} from './routes';
let app = express();
let appConfig = config.app;
let logger = appConfig.logger;

app.use(cors(appConfig.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Expose API
app.use('/api/', router);

// Start listening on configured port
let server = app.listen(appConfig.port, () => {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  logger.info('Listening on ' + bind);
  logger.info("Started application on mode " + app.get("env"));
});
