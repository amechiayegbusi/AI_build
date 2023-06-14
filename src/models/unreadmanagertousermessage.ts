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

class UnreadManagerToUserMessage extends Model<InferAttributes<UnreadManagerToUserMessage>, InferCreationAttributes<UnreadManagerToUserMessage>> {
  declare id: CreationOptional<number>;

  declare userId: number | null;

  declare msgId: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

UnreadManagerToUserMessage.init(
  {
    ...SequelizeAttributes.UnreadManagerToUserMessages,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'unread_manager_to_user_messages',
  }
);

export default UnreadManagerToUserMessage;
