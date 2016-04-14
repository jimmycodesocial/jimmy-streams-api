'use strict';

let app = require('express')();
let bodyParser = require('body-parser');
let cors = require('cors');
let config = require('config');
let logger = config.get('app.logger');

app.use(cors(config.get('app.cors')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start listening on configured port
let server = app.listen(config.get('app.port'), () => {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  logger.info('Listening on ' + bind);
  logger.info("Started application on mode " + app.get("env"));
});
