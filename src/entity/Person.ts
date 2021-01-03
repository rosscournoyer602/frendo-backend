import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthUser } from './AuthUser'

@Entity()
export class Person {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { nullable: true })
  first_name?: string;
}