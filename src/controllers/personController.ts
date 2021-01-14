import { Request, Response, } from 'express';
import { get, put, controller, use } from './decorators';
import { getConnection, getRepository } from 'typeorm';
import { Person } from '../entity/Person';
import { checkToken } from '../middleware/requireSignin'
import { requestValidator } from '../middleware/requestValidator'
import S3 from 'aws-sdk/clients/s3'

const credentials = {
  secretAccessKey: process.env.S3KEY,
  accessKeyId: process.env.S3KEYID,
  region: 'ap-northeast-1'
}

const s3 = new S3(credentials)

@controller('')
class PersonController {

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

	@put('/person')
	@use(checkToken)
	@use(requestValidator(['id']))
	async addPerson(req: Request, res: Response) {
		const repo = getRepository(Person)
		var { id, firstName, avatar, prevAvatar} = req.body
		// update avatar in AWS S3 bucket
		if (avatar) {
			const type = avatar.split(';')[0].split('/')[1]
			const buffer = Buffer.from(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64')
			const params = {
				Bucket: 'friendo2',
				Key: `${id}${Date.now()}.${type}`,
				Body: buffer,
				ACL: 'public-read',
				ContentEncoding: 'base64',
				ContentType: `image/${type}`
			};
			// delete any old avatar for this user i
			if (prevAvatar) {
				const deleteParams = {
					Bucket: 'friendo2',
					Delete: {
						Objects: [
							{ Key: `200x200/${prevAvatar}` },
							{ Key: `64x64/${prevAvatar}` },
							{ Key: `32x32/${prevAvatar}`}
						]
					}
				};
				try {
					const deleteResults = await s3.deleteObjects(deleteParams).promise()
					console.log(deleteResults)
				} catch (err) {
					console.log(err)
					res.status(500).send('An unexpected error has occured');
				}
			}
			// save avatar to s3 and return URL
			try {
				const uploadResults = await s3.upload(params).promise()
				avatar = uploadResults.Key
				console.log(uploadResults)
			} catch (err) {
				console.log(err)
				res.status(500).send('An unexpected error has occured')
			}
		}
		
		const personData = {
			id, 
			firstName: firstName || null,
			avatar: avatar || prevAvatar
		}
		try {
			const result = await repo.save(personData)
			res.status(200).send(result)
		} catch (err) {
			console.log(err)
			res.status(500).send('An unexpected error has occured')
		}
	}

}