import { Router } from 'express';
import { router as reservationRouter } from './routes/reservations';
import { router as membersRouter} from './routes/members';

export const router: Router = Router();

router.use('/reservations', reservationRouter);
router.use('/members', membersRouter);

