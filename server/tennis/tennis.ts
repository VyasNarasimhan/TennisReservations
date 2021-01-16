import { Router } from 'express';
import { router as reservationRouter } from './routes/reservations';

export const router: Router = Router();

router.use('/reservations', reservationRouter);
