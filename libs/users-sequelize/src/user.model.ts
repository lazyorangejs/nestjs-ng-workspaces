import {
  Column,
  Model,
  Table,
  DataType,
  AllowNull,
  PrimaryKey,
  IsUUID,
} from 'sequelize-typescript'
import { Email, User, UserId, Username } from '@lazyorange/domain'

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel> implements User {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUIDV4 })
  id: UserId

  @Column({ type: DataType.TEXT })
  email: Email

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  username?: Username
}
