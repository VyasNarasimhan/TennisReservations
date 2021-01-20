import db from '../../db/db';
import { NextFunction, Request, Response, Router } from 'express';

export const router: Router = Router();

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside reservations put' + req);
    try {
      const nameToInsert = req.body.enteredName;
      res.send({
        updated: (await db.query('insert into test (name) values ($1)',
          [
            nameToInsert 
          ])).rowCount
      });
      console.log("Saved " + req.body.enteredName);
    } catch (err) {
      return next(err);
    }
});

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ success: 'yay' });
});

