import { RequestHandler,Request, Response, NextFunction } from 'express'
import { runInNewContext } from 'vm'

export function bodyValidator(keys: string[]): RequestHandler {
	return function(req: Request, res: Response, next: NextFunction) {
		if (!req.body) {
			res.status(422).send('Invalid Request')
			return
		}

		for(let key of keys) {
			if (!req.body[key]) {
				res.status(422).send('Invalid Request')
			}
			return
		}
		next()
	}
}
