import { Router } from 'express';
import { router as reservationRouter } from './routes/reservations';
import { router as membersRouter} from './routes/members';
import { router as heartBeatRouter} from './routes/heartbeat';


export const router: Router = Router();

router.use('/reservations', reservationRouter);
router.use('/members', membersRouter);
router.use('/heartbeat', heartBeatRouter);

  