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
      res.status(422).send({ error: 'User already exists'});
    } else {
      res.send({
        updated: (await db.query('insert into users (email, displayName, role, password) values ($1, $2, $3, $4)',
          [
            user.enteredEmail.toUpperCase(), user.displayName, user.role.toUpperCase(), hash
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
        const password = req.body.enteredPassword;
        // tslint:disable-next-line: max-line-length
        const member = (await db.query('SELECT u.*, r.rolename FROM users u, roles r where u.role = r.id and $1 = u.email', [email])).rows[0];
        if (bcrypt.compareSync(password, member.password)) {
          const reservations = (await db.query('SELECT res.*, u.displayName FROM reservations res, users u where res.user_fk = u.id and res.reservation_date >= CURRENT_DATE and res.reservation_date < CURRENT_DATE + 7')).rows;
          res.send({memberInfo : member, allReservations : reservations});
        } else {
          res.status(401).send({ error: 'unauthorized' });
        }
    } catch (err) {
        console.log('Not found');
        return next(err);
    }
});

