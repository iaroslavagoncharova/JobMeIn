require('dotenv').config();
import express from 'express';
import api from './api';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler, notFound } from './middlewares';

const app = express();
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  })
);

app.use(morgan('dev'));

app.use(cors())
app.use(express.json());

// serve public folder for apidoc
app.use(express.static('public'));

app.use('/api/v1', api);

app.use(errorHandler, notFound);

export default app;
