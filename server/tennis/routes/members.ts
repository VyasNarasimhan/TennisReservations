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
        res.status(422).send({ error: 'User already exists' });
      }
      /*
      // tslint:disable-next-line: max-line-length
      else if ((await db.query('SELECT * FROM residents WHERE UPPER(user_email)=$1 OR UPPER(user_login)=$1', [user.wellesleyID.toUpperCase()])).rowCount === 0) {
        res.status(422).send({ error: 'Incorrect Wellesley Resident ID' });
      // tslint:disable-next-line: max-line-length
      } else if ((await db.query('SELECT * FROM residents WHERE UPPER(user_email)=$1 OR UPPER(user_login)=$1', [user.wellesleyID.toUpperCase()])).rows[0].active === false) {
        res.status(422).send({ error: 'Wellesley ID is deactivated'});
      } else if (!user.wellesleyID) {
        res.status(422).send({ error: 'No Wellesley ID was entered' });
      } else {
        // tslint:disable-next-line: max-line-length
        const wellesleyId = (await db.query('SELECT id FROM residents WHERE UPPER(user_login)=$1', [user.wellesleyID.toUpperCase()])).rowCount === 0 ? (await db.query('SELECT id FROM residents WHERE UPPER(user_email)=$1', [user.wellesleyID.toUpperCase()])).rows[0].id : (await db.query('SELECT id FROM residents WHERE UPPER(user_login)=$1', [user.wellesleyID.toUpperCase()])).rows[0].id;
        if ((await db.query('SELECT * FROM users WHERE resident_fk=$1', [wellesleyId])).rowCount >= 2) {
          res.status(422).send({ error: 'Account limit for this address has been reached' });
        } else {
          const id = (await db.query('SELECT id FROM roles WHERE rolename=\'RESIDENT\'')).rows[0].id;
          res.send({
            updated: (await db.query('insert into users (email, displayName, role, password, resident_fk) values ($1, $2, $3, $4, $5)',
              [
                user.enteredEmail.toUpperCase(), user.displayName, id, hash, wellesleyId
              // tslint:disable-next-line: max-line-length
              ])).rowCount, memberInfo: (await db.query('SELECT u.*, r.rolename FROM users u, roles r where u.role = r.id and $1 = u.email', [user.enteredEmail.toUpperCase()])).rows[0]
          });
        }
      }
      */
     // delete following lines when Tami wants to reenable resident link with account
      const id = (await db.query('SELECT id FROM roles WHERE rolename=\'RESIDENT\'')).rows[0].id;
      res.send({
        updated: (await db.query('insert into users (email, displayName, role, password) values ($1, $2, $3, $4)',
          [
            user.enteredEmail.toUpperCase(), user.displayName, id, hash
          // tslint:disable-next-line: max-line-length
          ])).rowCount, memberInfo: (await db.query('SELECT u.*, r.rolename FROM users u, roles r where u.role = r.id and $1 = u.email', [user.enteredEmail.toUpperCase()])).rows[0]
      });
      console.log('Saved ' + req.body.displayName);
    } else {
      res.send({ updated: 0 });
    }
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Inside members post' + req);
    try {
        const user = req.body;
        if (user) {
          const email = user.enteredEmail.toUpperCase();
          const password = user.enteredPassword;
          if (email === 'ADMIN' && password === 'Wellesley1234') {
            res.send({memberInfo: 'admin', allReservations: null});
          } else if (email === 'ADMIN' && password !== 'Wellesley1234') {
            res.status(422).send({ error: 'Incorrect username or password' });
          } else {
            // tslint:disable-next-line: max-line-length
            const member = (await db.query('SELECT u.*, r.rolename FROM users u, roles r where u.role = r.id and $1 = u.email', [email])).rows[0];
            if (!!member) {
              if (bcrypt.compareSync(password, member.password) && member.active) {
                res.send({memberInfo : member});
              } else if (!member.active) {
                res.status(422).send({ error: 'Account has been deactivated'});
              } else {
                res.status(422).send({ error: 'Incorrect username or password' });
              }
            } else {
              res.status(422).send({ error: 'Account does not exist' });
            }
          }
        } else {
          res.status(422).send({ error: 'Incorrect username or password' });
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
        res.status(422).send({ error: 'Could not change password' });
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
        res.status(422).send({ error: 'Could not change password or password was blank' });
      }
  } catch (err) {
      console.log('Error during forgot password .. Not found');
      return next(err);
  }
});

router.get('/user/:enteredEmail', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside user get');
  console.log(req.params);
  try {
    const getUser = (await db.query('SELECT * FROM users WHERE email=$1', [req.params.enteredEmail])).rows;
    if (getUser.length > 0) {
      const userRole = (await db.query('SELECT rolename FROM roles WHERE id=$1', [getUser[0].role])).rows[0];
      // tslint:disable-next-line: max-line-length
      res.send({user: (await db.query('SELECT u.*, r.rolename FROM users u, roles r where u.role = r.id and $1 = u.email', [req.params.enteredEmail])).rows[0], role: userRole});
    } else {
      res.status(422).send({error: 'Could not find user with that email'});
    }
  } catch (err) {
    return next(err);
  }
});

router.post('/changerole', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside changerole post');
  const user = req.body;
  const newRole = (user.userRole === 'COACH') ? 'RESIDENT' : 'COACH';
  const newRoleId = (await db.query('SELECT id FROM roles WHERE rolename=$1', [newRole])).rows[0].id;
  try {
    res.send({updated: (await db.query('UPDATE users SET role=$1 WHERE email=$2', [newRoleId, user.email])), role: newRole});
  } catch (err) {
    return next(err);
  }
});

router.post('/newAccount', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside newAccount post');
  const account = req.body;
  try {
    // tslint:disable-next-line: max-line-length
    if ((await db.query('SELECT * FROM residents WHERE user_login = $1 AND user_email = $2', [account.newEmail, account.enteredUsername])).rowCount > 0) {
      res.status(422).send({ error: 'Wellesley Resident Account already exists' });
    } else {
      // tslint:disable-next-line: max-line-length
      res.send({updated: (await db.query('INSERT INTO residents (user_email, user_login) VALUES ($1, $2)', [account.newEmail, account.enteredUsername]))});
    }
  } catch (err) {
    return next(err);
  }
});

router.post('/changeActive', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside changeActive post');
  const user = req.body;
  try {
    const newActive = !user.active;
    // tslint:disable-next-line: max-line-length
    res.send({updated: (await db.query('UPDATE users SET active=$1 WHERE email=$2', [newActive, user.email.toUpperCase()])), active: newActive});
  } catch (err) {
    return next(err);
  }
});

router.post('/changeActiveForResidents', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside changeActiveResidents post');
  const user = req.body;
  try {
    const newActive = !user.active;
    // tslint:disable-next-line: max-line-length
    const changeResidentStatus = (await db.query('UPDATE residents SET active=$1 WHERE UPPER(user_email)=$2 and UPPER(user_login)=$3', [newActive, user.user_email.toUpperCase(), user.user_login.toUpperCase()]));
    let deactivateUsers: any;
    // tslint:disable-next-line: max-line-length
    const id = (await db.query('SELECT * FROM residents WHERE UPPER(user_email)=$1 and UPPER(user_login)=$2', [user.user_email.toUpperCase(), user.user_login.toUpperCase()])).rows[0].id;
    deactivateUsers = (await db.query('UPDATE users SET active=$1 WHERE resident_fk=$2', [newActive, id]));
    res.send({updated: changeResidentStatus, deactivatedUsers: deactivateUsers, active: newActive});
  } catch (err) {
    return next(err);
  }
});

router.get('/searchForResident/:email/:username', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside search resident get');
  try {
    // tslint:disable-next-line: max-line-length
    const residentQuery = (await db.query('SELECT * FROM residents WHERE UPPER(user_email)=$1 and UPPER(user_login)=$2', [req.params.email.toUpperCase(), req.params.username.toUpperCase()]));
    if (residentQuery.rowCount > 0) {
      res.send({resident: residentQuery.rows[0]});
    } else {
      res.status(422).send({ error: 'Could not find resident with that username and email' });
    }
  } catch (err) {
    return next(err);
  }
});

router.get('/sendFeedbackEmail/:name/:email/:feedback', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside send feedback email');
  try {
    // tslint:disable-next-line: max-line-length
    emailservice.sendEmail(emailservice.buildFeedbackEmailConfig(req.params.name, req.params.email, 'wellesleyhoa.tennis@gmail.com', req.params.feedback));
    res.send({ success: 'Feedback has been sent'});
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get('/getAllUsers', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside getAllUsers');
  try {
    const users = (await db.query('SELECT * FROM users'));
    res.send({users: users.rows});
  } catch (err) {
    return next(err);
  }
});
