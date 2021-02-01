import db from '../../db/db';
import { NextFunction, Request, Response, Router } from 'express';

export const router: Router = Router();

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside reservations put' + req);
  const reservation = req.body;
  const memberInfo = JSON.parse(reservation.member);
  const updatedReservations = (await db.query('SELECT res.*, u.displayName FROM reservations res, users u where res.user_fk = u.id and res.reservation_date >= CURRENT_DATE and res.reservation_date < CURRENT_DATE + 7')).rows;
  try {
    res.send({
      updated: (await db.query('insert into reservations (user_fk, dateCreated, timeslot, court, reservation_date) values ($1, CURRENT_DATE, $2, $3, $4)',
        [
          memberInfo.id, reservation.timeslot, reservation.courtnumber, reservation.date
        ])).rowCount, newReservations: updatedReservations
    });
    console.log('Saved ' + req.body);
  } catch (err) {
    return next(err);
  }
});

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ success: 'yay' });
});

