import { Request, Response } from 'express';
import { get, post, controller, use } from './decorators';
const pool = require('../db');


@controller('')
class UserController {

  @get('/person')
  async getPerson(req: Request, res: Response) {
    const query = {
      name: 'get-person',
      text: 'SELECT * \
             FROM person \
             WHERE email = ($1);',
      values: [req.query.email]
    };
    try {
      const getPersonResult = await pool.query(query);
      res.send(getPersonResult);
    } catch (err) {
      res.send(err);
    }
  }
}