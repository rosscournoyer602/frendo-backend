import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm"
import { Friendship } from './Friendship'

@Entity()
export class Chat {

  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => Friendship)
  @JoinColumn()
  friendship!: Friendship

  @Column()
  messages!: string
}