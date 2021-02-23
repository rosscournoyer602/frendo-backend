import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, Unique, Check } from "typeorm";
import { Person } from './Person'

@Entity()
@Unique("pair", ["personOne", "personTwo"])
@Check(`'personOne.id' < 'personTwo.id'`)
export class Friendship {

  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => Person)
  @JoinColumn()
  personOne!: Person

  @OneToOne(type => Person)
  @JoinColumn()
  personTwo!: Person

  @Column()
  status!: number

  @Column()
  actionTaker!: number
}