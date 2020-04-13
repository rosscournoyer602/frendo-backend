import { RequestHandler,Request, Response, NextFunction } from 'express'
const passport = require('passport');

export function signIn(): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    const requireSignin = passport.authenticate('local', { session: false });
    if (!requireSignin) {
      res.send('Authentication Error');
    } else {
      next();
    }
  }
}