import db from '../../db/db';
import { NextFunction, Request, Response, Router } from 'express';

export const router: Router = Router();

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside reservations create' + req);
  const reservation = req.body;
  console.log(reservation);
  const memberInfo = reservation.member;
  try {
    // tslint:disable-next-line: max-line-length
    const checkIfExists = (await db.query('SELECT * FROM reservations WHERE reservation_date = $1 and timeslot = $2 and court = $3 and canceled = false', [reservation.date, reservation.timeslot, reservation.courtnumber]));
    if (checkIfExists.rowCount > 0) {
      res.status(420).send({error: 'Reservation already exists'});
    } else {
      res.send({
        updated: (await db.query('insert into reservations (user_fk, dateCreated, timeslot, court, reservation_date, canceled) values ($1, CURRENT_DATE, $2, $3, $4, $5)',
          [
            memberInfo.id, reservation.timeslot, reservation.courtnumber, reservation.date, false
          ])).rowCount, newReservations: (await db.query('SELECT res.*, u.displayName FROM reservations res, users u where res.user_fk = u.id and res.reservation_date >= CURRENT_DATE and res.reservation_date < CURRENT_DATE + 14 and canceled = false')).rows
      });
      console.log('Saved ' + req.body);
    }
  } catch (err){
    console.log(err);
    res.status(410).send({ error: 'Could not make reservation' });
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside reservations update' + req);
  const reservation = req.body;
  const memberInfo = reservation.member;
  try {
    // tslint:disable-next-line: max-line-length
    const cancel = (await db.query('UPDATE reservations SET canceled = true where user_fk = $1 and reservation_date = $2 and timeslot = $3 and court = $4', [memberInfo.id, reservation.date.slice(0, 10), reservation.timeslot, reservation.courtnumber]));
    console.log(cancel.rowCount);
    res.send({canceledRows: cancel, newReservations: (await db.query('SELECT res.*, u.displayName FROM reservations res, users u where res.user_fk = u.id and res.reservation_date >= CURRENT_DATE and res.reservation_date < CURRENT_DATE + 14 and canceled = false')).rows});
  } catch (err) {
    console.log('Could not cancel reservation');
    return next(err);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside maintenance get');
  try {
    res.send({maintenanceStatus: (await db.query('SELECT * FROM maintenance')).rows});
  } catch (err) {
    console.log('Could not get maintenance');
    return next(err);
  }
});

router.post('/modifyMaintenance', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside status post');
  try {
    // tslint:disable-next-line: max-line-length
    res.send({updated: (await db.query('UPDATE maintenance SET inmaintenance=$1, message=$2 WHERE court=$3', [req.body.values.inmaintenance, req.body.values.message, req.body.court]))});
  } catch (err) {
    console.log('Could not set status');
    return next(err);
  }
});

router.get('/getReservations', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside reservations get');
  try {
    res.send({allReservations: (await db.query('SELECT res.*, u.displayName FROM reservations res, users u where res.user_fk = u.id and res.reservation_date >= CURRENT_DATE and res.reservation_date < CURRENT_DATE + 14 and canceled = false')).rows});
  } catch (err) {
    console.log('Could not get reservations');
    return next(err);
  }
});

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside reservations delete');
  try {
    res.send({deleteReservations: (await db.query('DELETE FROM reservations WHERE dateCreated < CURRENT_DATE - 180'))});
  } catch (err) {
    console.log('Could not get reservations');
    return next(err);
  }
});
