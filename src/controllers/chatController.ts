import { Request, Response, } from 'express'
import { get, put, controller, use } from './decorators'
import { getRepository } from 'typeorm'
import { checkToken } from '../middleware/requireSignin'
import { Friendship } from '../entity/Friendship'
import { Person } from '../entity/Person'
import { Chat } from '../entity/Chat'
import { requestValidator } from '../middleware/requestValidator'

const io = require('../WebSocket')

@controller('')
class ChatController {

	@put('/chat')
	@use(requestValidator(['id', 'messages'], 'body'))
	@use(checkToken)
	async addChat(req: Request, res: Response) {
		const { id, messages } = req.body
		try {
			const result = await getRepository(Chat).save({
				id,
				messages
			})
			res.status(200).send(result)
		} catch (err) {
			console.log(err)
			res.status(500).send('An unexpected error has occured')
		}
	}

	@get('/chat')
	// @use(requestValidator(['id'], 'query'))
	@use(checkToken)
	async getChat(req: Request, res: Response) {
		const id = req.query.id
		try {
			const	result = await getRepository(Chat).createQueryBuilder('chat')
			.where('chat.friendship = :id', {
				id
			})
			.getOne()
			res.status(200).send(result)
		} catch (err) {
			console.log(err)
			res.status(500).send('An unexpected error has occured')
		}
	}
}