import { Request, Response, NextFunction } from 'express'
import jwt from 'jwt-simple'
import bcrypt from 'bcrypt'
import { get, post, controller, use } from './decorators'
import { signIn } from '../middleware/requireSignin'
import { getRepository } from 'typeorm'
import { AuthUser } from '../entity/AuthUser'
import { Person } from '../entity/Person'

function tokenForUser(userEmail: string) {
  const timestamp = new Date().getTime() / 1000;
  return jwt.encode({ sub: userEmail, iat: timestamp }, process.env.SECRET || '');
}

@controller('')
class AuthController {

  @post('/signup')
  async signup (req: Request, res: Response) {
		const { email } = req.body
		const userRepo = getRepository(AuthUser)
		const personRepo = getRepository(Person)
		const user = await userRepo.findOne({ email })
		if (user) {
			res.status(409).send(`User already exists with id: ${email}`)
		} else {
			try {
				bcrypt.hash(req.body.password, 10, async (err, hash) => {
					if (err) {
						res.status(500).send('An unexpected error has occured')
					}
					const newPerson = await personRepo.save({})
					await userRepo.save({
						email: req.body.email,
						password: hash,
						person: newPerson
					})
					res.status(200).send({
						token: tokenForUser(email)
					})
				})
			} catch (err) {
				res.status(500).send('An unexpected error has occured')
			}
			
		}
  }

	@post('/signin')
	//todo validate body middleware
	@use(signIn)
  async signin(req: Request, res: Response) {
	const { email } = req.body
	res.send({ token: tokenForUser(email) })
  //   // user has had their email and password authed using passport.js local strategy
  //   // we just need to give them a token
  //   res.send({ token: tokenForUser(req.body.user) });
  }
}