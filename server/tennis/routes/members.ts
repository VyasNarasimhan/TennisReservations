import db from '../../db/db';
import { NextFunction, Request, Response, Router } from 'express';

export const router: Router = Router();

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside members put' + req);
  try {
    const nameToInsert = req.body.enteredName;
    res.send({
      updated: (await db.query('insert into test (name) values ($1)',
        [
          nameToInsert
        ])).rowCount
    });
    console.log('Saved ' + req.body.enteredName);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Inside members post' + req);
    try {
        const email = req.body.enteredEmail;
        const password = req.body.enteredPassword;
        res.send((await db.query('SELECT email, password FROM users where $1 = email AND $2 = password ', [email, password])));
    } catch (err) {
        console.log('Not found');
        return next(err);
    }
});

