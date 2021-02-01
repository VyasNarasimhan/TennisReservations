import db from '../../db/db';
import { NextFunction, Request, Response, Router } from 'express';

export const router: Router = Router();

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside reservations put' + req);
  const reservation = req.body;
  console.log(reservation);
  const memberInfo = JSON.parse(reservation.member);
  try {
    res.send({
      updated: (await db.query('insert into reservations (user_fk, dateCreated, timeslot, court, reservation_date) values ($1, CURRENT_DATE, $2, $3, $4)',
        [
          memberInfo.id, reservation.timeslot, reservation.courtnumber, reservation.date
        ])).rowCount
    });
    console.log('Saved ' + req.body);
  } catch (err) {
    return next(err);
  }
});

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ success: 'yay' });
});

