import db from '../../db/db';
import { NextFunction, Request, Response, Router } from 'express';

export const router: Router = Router();



router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside heartbeat');
  try {
    res.send({success: 'Im Alive'});
  } catch (err) {
    console.log('err');
  }
});
