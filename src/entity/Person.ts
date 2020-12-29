import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthUser } from './AuthUser'

@Entity()
export class Person {

  @PrimaryGeneratedColumn()
  person_id!: number;

  @Column()
  first_name?: string

	@Column()
	@OneToOne(type => AuthUser)
  email!: string
}