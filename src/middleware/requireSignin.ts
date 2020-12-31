import { RequestHandler,Request, Response, NextFunction } from 'express'
import passport from 'passport'
import '../services/PassportService'


export function signIn(req: Request, res: Response, next: NextFunction) {
	console.log('PPOER', passport)
		passport.authenticate('local', { session: false }, (req, res) => {
			console.log('REQIRE', req.body)
		})
    // if (!requireSignin) {
		// 	res.send('Authentication Error');
		// 	next();
    // } else {
    //   next();
    // }
}