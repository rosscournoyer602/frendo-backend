import {Entity, Column, PrimaryColumn, OneToOne} from "typeorm";
import { Person } from './Person'

@Entity()
export class AuthUser {

	@PrimaryColumn()
	@OneToOne(type => Person, {
		cascade: true
	})
  email!: string;

  @Column()
  password!: string
}