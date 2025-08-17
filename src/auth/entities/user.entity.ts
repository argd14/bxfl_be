import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

  @ObjectIdColumn()
  _id: ObjectId

  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column('varchar', { unique: true, length: 255 })
  email: string;

  @Column('varchar', { length: 255, select: false })
  password: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  lastName: string;

  @Column('varchar', { length: 255 })
  gender: string;

  @Column('date')
  dob: Date;

  @Column('varchar', { length: 255 })
  phone: string;

  @Column('boolean')
  status: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
