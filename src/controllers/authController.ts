import { Request, Response } from 'express';
import { get, post, controller, use } from './decorators';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';
const pool = require('../db');
import { signIn } from '../middleware/requireSignin';

function tokenForUser(userEmail: string) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: userEmail, iat: timestamp }, process.env.SECRET || 'localsecret');
}

@controller('')
class AuthController {

  @post('/signup')
  signup (req: Request, res: Response): void {
    pool.connect()
      .then((client: any) => {
        bcrypt.genSalt(10, (err: any, salt: any) => {
          bcrypt.hash(req.body.password, salt, null, (err: any, hash: any) => {
            const addPersonQuery = 'INSERT INTO auth_user (email, password_hash) VALUES ($1, $2)';
            const addUserParams = [req.body.email, hash];
            client
              .query(addPersonQuery, addUserParams)
              .then(() => {
                res.status(200).json({ token: tokenForUser(req.body.email) });
                client.release();
              })
              .catch((err: any) => {
                res.send(err);
                client.release();
              });
          });
        });
      })
      .catch((err: any) => {
        res.send(`Encountered unknown error: ${err}`);
        // client.release();
      });
  }

  @post('/signin')
  // @use(signIn)
  signin (req: Request, res: Response): void {
    // user has had their email and password authed using passport.js local strategy
    // we just need to give them a token
    res.send({ token: tokenForUser(req.body.user) });
  }
}