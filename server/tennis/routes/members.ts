import db from '../../db/db';
import { NextFunction, Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';
import emailservice from '../services/emailservice';

export const router: Router = Router();

const SALT = 9;

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside members put' + req);
  try {
    const user = req.body;
    if (user) {
      const existingUserResult = await db.query('SELECT email FROM users WHERE $1 = email', [user.enteredEmail.toUpperCase()]);
      const hash = bcrypt.hashSync(user.enteredPassword, SALT);
      if (existingUserResult.rows.length === 1) {
        res.status(422).send({ error: 'User already exists'});
      } else {
        const id = (await db.query('SELECT id FROM roles WHERE rolename=\'RESIDENT\'')).rows[0].id;
        res.send({
          updated: (await db.query('insert into users (email, displayName, role, password) values ($1, $2, $3, $4)',
            [
              user.enteredEmail.toUpperCase(), user.displayName, id, hash
            // tslint:disable-next-line: max-line-length
            ])).rowCount, memberInfo: (await db.query('SELECT u.*, r.rolename FROM users u, roles r where u.role = r.id and $1 = u.email', [user.enteredEmail.toUpperCase()])).rows[0], allReservations: (await db.query('SELECT res.*, u.displayName FROM reservations res, users u where res.user_fk = u.id and res.reservation_date >= CURRENT_DATE and res.reservation_date < CURRENT_DATE + 7 and canceled = false')).rows
        });
      }
      console.log('Saved ' + req.body.displayName);
    } else {
      res.send({ updated: 0 });
    }
  } catch (err) {
    return next(err);
  }

});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Inside members post' + req);
    try {
        const user = req.body;
        if (user) {
          const email = user.enteredEmail.toUpperCase();
          const password = user.enteredPassword;
          if (email === 'ADMIN' && password === '1234') {
            res.send({memberInfo: 'admin', allReservations: null});
          } else {
            // tslint:disable-next-line: max-line-length
            const member = (await db.query('SELECT u.*, r.rolename FROM users u, roles r where u.role = r.id and $1 = u.email', [email])).rows[0];
            if (bcrypt.compareSync(password, member.password)) {
              const reservations = (await db.query('SELECT res.*, u.displayName FROM reservations res, users u where res.user_fk = u.id and res.reservation_date >= CURRENT_DATE and res.reservation_date < CURRENT_DATE + 7 and canceled = false')).rows;
              res.send({memberInfo : member, allReservations : reservations});
            } else {
              res.status(401).send({ error: 'Incorrect username or password' });
            }
          }
        } else {
          res.status(401).send({ error: 'Incorrect username or password' });
        }
    } catch (err) {
        console.log('Not found');
        return next(err);
    }
});

router.post('/change', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside members post' + req);
  try {
      const chgpwddata = req.body;
      if (chgpwddata) {
        const password = chgpwddata.data.enteredPassword;
        const hash = bcrypt.hashSync(password, SALT);
        const email = chgpwddata.userInfo.email;
        const changePassword = (await db.query('UPDATE users SET password = $1 WHERE email = $2', [hash, email]));
        res.send({updated: changePassword});
      }
      else {
        res.status(401).send({ error: 'Could not change password' });
      }
  } catch (err) {
      console.log('change password error');
      return next(err);
  }
});

router.post('/forgot', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside forgot password..' + req);
  try {
      const forgotpwddata = req.body;
      if (forgotpwddata) {
        const email = req.body.data.enteredEmail;
        const possible = '1234567890qwertyuiopasdfghjklzxcvbnm';
        let newPass = '';
        for (let i = 0; i < 8; i++) {
          newPass += possible.charAt(Math.floor(Math.random() * 36));
        }
        const hash = bcrypt.hashSync(newPass, SALT);
        const changePassword = (await db.query('UPDATE users SET password = $1 WHERE email = $2', [hash, email.toUpperCase()]));
        emailservice.sendEmail(emailservice.buildPasswordResetEmailConfig('wellesleyhoa.tennis@gmail.com', email, newPass));
        res.send({updated: changePassword, newPassword: newPass});
      } else {
        res.status(401).send({ error: 'Could not change password or password was blank' });
      }
  } catch (err) {
      console.log('Error during forgot password .. Not found');
      return next(err);
  }
});

router.post('/user', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside user get');
  console.log(req.body);
  const getUser = (await db.query('SELECT * FROM users WHERE email=$1', [req.body.enteredEmail])).rows[0];
  const userRole = (await db.query('SELECT rolename FROM roles WHERE id=$1', [getUser.role])).rows[0];
  try {
    res.send({user: (await db.query('SELECT * FROM users WHERE email=$1', [req.body.enteredEmail])).rows[0], role: userRole});
  } catch (err) {
    return next(err);
  }
});

router.post('/changerole', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside changerole get');
  const user = req.body;
  const newRole = (user.userRole === 'COACH') ? 'RESIDENT' : 'COACH';
  const newRoleId = (await db.query('SELECT id FROM roles WHERE rolename=$1', [newRole])).rows[0].id;
  try {
    res.send({updated: (await db.query('UPDATE users SET role=$1 WHERE email=$2', [newRoleId, user.email])), role: newRole});
  } catch (err) {
    return next(err);
  }
});
