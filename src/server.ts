import express from 'express';

import bodyParser = require('body-parser');
import dotenv = require('dotenv');
import cors = require('cors');
import cookieParser = require('cookie-parser');
import router from './routes/index';
import logger from './helpers/logger';
import morganMiddleware from './middlewares/morgan.middleware';
import errorMiddleware from './middlewares/error.middleware';
import { customResponse } from './helpers/responce';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({ origin: '*' }));

app.use(morganMiddleware);

app.use('/api/v1', router);
app.use(errorMiddleware);

//global error handler

app.use((req: express.Request, res: express.Response) =>
  customResponse(res, 404, { code: 404, message: 'Not Found' })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});
