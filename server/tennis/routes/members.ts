import db from '../../db/db';
import { NextFunction, Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';

export const router: Router = Router();

const SALT = 9;

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside members put' + req);
  try {
    const user = req.body;
    const existingUserResult = await db.query('SELECT email FROM users WHERE $1 = email', [req.body.enteredEmail.toUpperCase()]);
    const hash = bcrypt.hashSync(user.enteredPassword, SALT);
    if (existingUserResult.rows.length === 1) {
      res.send();
    } else {
      res.send({
        updated: (await db.query('insert into users (email, password, displayName, role) values ($1, $2, $3, $4)',
          [
            user.enteredEmail.toUpperCase(), hash.toUpperCase(), user.displayName.toUpperCase(), user.role.toUpperCase()
          ])).rowCount
      });
    }
    console.log('Saved ' + req.body.displayName);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Inside members post' + req);
    try {
        const email = req.body.enteredEmail.toUpperCase();
        const password = req.body.enteredPassword.toUpperCase();
        const member = (await db.query('SELECT * FROM users where $1 = email', [email])).rows[0];
        if (bcrypt.compareSync(password, member.password)) {
          res.send(member);
        } else {
          res.send();
        }
    } catch (err) {
        console.log('Not found');
        return next(err);
    }
});

