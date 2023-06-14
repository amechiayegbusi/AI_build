import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
} from 'sequelize';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import db from './_instance';
import User from './user';

class UserToManagerMessage extends Model<InferAttributes<UserToManagerMessage>, InferCreationAttributes<UserToManagerMessage>> {
  declare id: CreationOptional<number>;

  declare type: number;

  declare managerId: number | null;

  declare userId: number | null;

  declare msg: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

UserToManagerMessage.init(
  {
    ...SequelizeAttributes.UserToManagerMessages,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'UserToManagerMessages',
  }
);

export default UserToManagerMessage;
