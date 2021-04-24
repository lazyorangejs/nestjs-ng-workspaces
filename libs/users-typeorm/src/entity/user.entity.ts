import { Email, User, UserId, Username } from '@lazyorange/domain'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: UserId

  @Column({ type: 'text', nullable: true })
  username?: Username = null

  @Column({ type: 'text' })
  email: Email
}
