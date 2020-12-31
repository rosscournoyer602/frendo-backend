import { Request, Response, NextFunction } from 'express';
import { get, post, controller, use } from './decorators';
import { signIn } from '../middleware/requireSignin'

function logger(req: Request, res: Response, next: NextFunction) {
	console.log('Signin', req.body)
	next();
}

@controller('')
class AuthController {
  @post('/signup')
  signup (req: Request, res: Response): void {

  }

	@post('/signin')
	@use(logger)
  @use(signIn)
  signin (req: Request, res: Response): void {
	console.log('REQBODY', req.body)
	res.send('ok')
  //   // user has had their email and password authed using passport.js local strategy
  //   // we just need to give them a token
  //   res.send({ token: tokenForUser(req.body.user) });
  }
}