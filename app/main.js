'use strict';

import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import paginate from 'express-paginate';
import {default as router} from './routes';
let app = express();
let appConfig = config.app;

app.use(cors(appConfig.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(paginate.middleware(appConfig.defaultLimit, appConfig.maxLimit));

// Expose API
app.use('/api/', router);

export default app;
