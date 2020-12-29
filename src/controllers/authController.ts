import { Request, Response } from 'express';
import { get, post, controller, use } from './decorators';
import {getRepository } from 'typeorm';
import { AuthUser } from '../entity/AuthUser';
import { PassportService } from '../services/PassportService'

@controller('')
class AuthController {
	constructor() {
		this.passportService.initialize()
	}

	private passportService = new PassportService()

  @post('/signup')
  signup (req: Request, res: Response): void {

  }

  @post('/signin')
  // @use(signIn)
  signin (req: Request, res: Response): void {
  //   // user has had their email and password authed using passport.js local strategy
  //   // we just need to give them a token
  //   res.send({ token: tokenForUser(req.body.user) });
  }
}