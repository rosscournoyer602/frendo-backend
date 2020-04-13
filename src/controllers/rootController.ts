import { Request, Response } from 'express';
import { get, controller, use } from './decorators';
// import { requireAuth } from '../middleware/requireAuth';

@controller('')
class RootController {

  @get('/')
  getRoot (req: Request, res: Response) {
    res.send('Hello!');
  }
}