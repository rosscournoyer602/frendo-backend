import { Request, Response } from 'express';
import { get, post, controller, use } from './decorators';
import { getConnection, Connection } from 'typeorm';
import { Person } from '../entity/Person';


@controller('')
class UserController {

  

  @get('/person')
  async getPerson(req: Request, res: Response) {
    const people = await getConnection('default').manager.find(Person);
    res.send(people);
  }

  @post('/person')
  async addPerson(req: Request, res: Response) {
    const newPerson = new Person();
    console.log(req)
    newPerson.email = req.body.email;
    newPerson.first_name = req.body.first_name;
    await getConnection('default').manager.save(newPerson);
    res.send(newPerson);
  }
}