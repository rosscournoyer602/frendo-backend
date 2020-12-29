import { Request, Response } from 'express';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import passport from 'passport';
import {getRepository } from 'typeorm';
import { AuthUser } from '../entity/AuthUser';

export class PassportService {

	public initialize = () => {
		passport.use('jwt', this.getStrategy())
		return passport.initialize()
	}

	private getStrategy = (): Strategy => {
		const params = {
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJwt.fromAuthHeader(),
			passReqToCallback: true
		}

		return new Strategy(params, async (payload: any, done: VerifiedCallback) => {
			try {
				const user = await getRepository(AuthUser).findOne({ email: payload });
				if (user) {
					done(null, user)
				} else {
					done(null, false)
				}
			} catch (err) {
				done(err, false)
			}
		})

	}
}