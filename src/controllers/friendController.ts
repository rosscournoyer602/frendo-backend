import { Request, Response, } from 'express'
import { get, put, controller, use } from './decorators'
import { getRepository } from 'typeorm'
import { checkToken } from '../middleware/requireSignin'
import { Friendship } from '../entity/Friendship'
import { Chat } from '../entity/Chat'
import { requestValidator } from '../middleware/requestValidator'

@controller('')
class FriendshipController {

  @get('/friends')
  // @use(requestValidator(['wuery'], 'query'))
  @use(checkToken)
  async getFriends(req: Request, res: Response) {
    const { id } = req.query
    const friends = await getRepository(Friendship).find({
        where: [
          { personOne: id},
          { personTwo: id}
        ],
        relations: ['personOne', 'personTwo']
    })
    res.send(friends);
  }

  @put('/friends')
  @use(checkToken)
  @use(requestValidator(['id1', 'id2', 'status', 'actionTaker'], 'body'))
  async addFriends(req: Request, res: Response) {
    const { id1, id2, status, actionTaker } = req.body
    const repo = getRepository(Friendship)
  
    let personOneId
    let personTwoId
    // make sure theres one entry per pair
    if (id1 > id2) {
      personOneId = id2
      personTwoId = id1
    } else {
      personOneId = id1
      personTwoId = id2
    }
    try {
      // check if the friendship already exists
      const existingEntry = await repo.createQueryBuilder('friendship')
      .where("friendship.personOne = :personOneId AND friendship.personTwo = :personTwoId", {
        personOneId, personTwoId
      })
      .getOne()
      // if not, create it
      if (!existingEntry) {
        try {
          const result = await repo.save({
            personOne: personOneId,
            personTwo: personTwoId,
            status,
            actionTaker
          })

          getRepository(Chat).save({
            friendship: result,
            messages:'[{ "sender": null, "content": "Start Chatting!" }]'
          })
          res.status(200).send(result)
        } catch (err) {
          console.log(err)
          res.status(500).send('An unexpected error has occured')
        }
      // if it does already exist, update it
      } else {
        existingEntry.actionTaker = actionTaker
        existingEntry.status = status
        try {
          const result = await repo.save(existingEntry)
          res.status(200).send(result)
        } catch (err) {
          console.log(err)
          res.status(500).send('An unexpected error has occured')
        }
      }
    } catch (err) {
      console.log(err)
      res.send(500).send('An unexpected error has occured')
    }
  }
}