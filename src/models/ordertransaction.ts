import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';
import User from './user';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';

class OrderTransaction extends Model<InferAttributes<OrderTransaction>, InferCreationAttributes<OrderTransaction>> {
  declare id: CreationOptional<number>;
  declare idOrder: number;
  declare idTransaction: number;
  declare shares: number;
  declare idTerminal: number;
  declare idAgent: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

OrderTransaction.init(
  {
    ...SequelizeAttributes.OrderTransaction,
    
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'order_transaction',
  }
)

export default OrderTransaction;