import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Person {

  @PrimaryGeneratedColumn()
  person_id!: number;

  @Column()
  first_name?: string

  @Column()
  email!: string
}