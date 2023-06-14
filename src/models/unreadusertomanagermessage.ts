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

class UnreadUserToManagerMessage extends Model<InferAttributes<UnreadUserToManagerMessage>, InferCreationAttributes<UnreadUserToManagerMessage>> {
  declare id: CreationOptional<number>;

  declare managerId: number | null;

  declare msgId: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

UnreadUserToManagerMessage.init(
  {
    ...SequelizeAttributes.UnreadUserToManagerMessages,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'unread_user_to_manager_messages',
  }
);

export default UnreadUserToManagerMessage;
