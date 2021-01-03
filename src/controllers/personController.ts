import { Request, Response, } from 'express';
import { get, post, controller, use } from './decorators';
import { getConnection, getRepository } from 'typeorm';
import { Person } from '../entity/Person';
import { checkToken } from '../middleware/requireSignin'


@controller('')
class UserController {

	@get('/people')
	@use(checkToken)
  async getPeople(req: Request, res: Response) {
    const people = await getConnection('default').manager.find(Person);
    res.send(people);
	}
	
	@get('/person')
	@use(checkToken)
  async getPerson(req: Request, res: Response) {
		const id = req.query.id as string
    const people = await getRepository(Person).findOne(id);
    res.send(people);
	}

}