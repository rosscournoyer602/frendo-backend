import { RequestHandler,Request, Response, NextFunction } from 'express'
import passport from 'passport'
import '../services/PassportService'

export function signIn(req: Request, res: Response, next: NextFunction) {
	passport.authenticate('local', (err, user, info) => {
		console.log('HHHYEYEYEYE', err, user, info)
	})(req, res, next)
	next()
}