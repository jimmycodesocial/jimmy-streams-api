'use strict';

import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {default as router} from './routes';
let app = express();

app.use(cors(config.app.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Expose API
app.use('/api/', router);

export default app;
