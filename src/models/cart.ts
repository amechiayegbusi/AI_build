import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';
import User from './user';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: CreationOptional<number>;
  declare idUser: number;
  declare title: string;
  declare description: string;
  declare amount: number;
  declare count: number;
  declare duration: number;
  declare drawDays: string;
  declare reference: string;
  declare type: number;
  declare status: number;
  declare buyType: number;
  declare idLottery: number;
  declare idGroup: number;
  declare shares: number;
  declare idVip: number;
  declare idAgent: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

Cart.init(
  {
    ...SequelizeAttributes.Cart,
    idUser: {
      references: {
        model: User,
        key: 'id',
      }
    },
    idLottery: {
      references: {
        
      }
    },
    idGroup: {
      references: {

      }
    },
    idVip: {
      references: {
        
      }
    },
    idAgent: {
      references: {
        
      }
    },
    idTerminal: {
      references: {
        
      }
    }
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'cart',
  }
)

export default Cart;