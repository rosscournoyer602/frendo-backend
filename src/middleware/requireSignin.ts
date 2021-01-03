import { RequestHandler,Request, Response, NextFunction } from 'express'
import passport from 'passport'
import './passportConfig'

export function signIn(req: Request, res: Response, next: NextFunction) {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			res.status(401).json({ status: "error", code: "unauthorized" });
		}
		if (!user) {
			res.status(401).json({ status: "error", code: "unauthorized" });
		} else {
			next();
		}
	})(req, res, next)
}