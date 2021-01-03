import { Request, Response, NextFunction } from 'express';
import { get, post, controller, use } from './decorators';
import { signIn } from '../middleware/requireSignin'

@controller('')
class AuthController {
  @post('/signup')
  signup (req: Request, res: Response): void {
		// check if there is already one
		// if not, add one
		// give user a token
  }

	@post('/signin')
	@use(signIn)
  signin (req: Request, res: Response): void {
	res.send('ok')
  //   // user has had their email and password authed using passport.js local strategy
  //   // we just need to give them a token
  //   res.send({ token: tokenForUser(req.body.user) });
  }
}