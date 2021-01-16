import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';

import { router as tennisRouter } from './tennis/tennis';

dotenv.config();

const app = express()
  .use(cors())
  .use(express.json())
  .use('/tennis', tennisRouter);

app.listen(4201, () => {
  return console.log('My Node App listening on port 4201');
});

export default app;
