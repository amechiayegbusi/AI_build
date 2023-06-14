import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';

import moment from 'moment';

import Lottery from './lottery';
import Draw from './draw';
import Ticket from './ticket';
import Transaction from './transaction';

import { OrderType } from 'constants/ConstOrder';

import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
  Association,
} from 'sequelize';

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare idUser: number;
  declare idCart: number;
  declare amount: number;
  declare prize: number;
  declare duration: number;
  declare drawDayCurrent: number;
  declare drawDays: string;
  declare reference: string;
  declare type: number;
  declare status: number;
  declare buyType: number;
  declare idLottery: number;
  declare mainNumbers: string;
  declare bonusNumbers: string;
  declare idTicket: string;
  declare idGroup: number;
  declare shares: number;
  declare idVip: number;
  declare idAgent: number;
  declare idTerminal: number;
  declare idVoucherUser: number;

  declare lottery: NonAttribute<Lottery | null>;
  declare ticket: NonAttribute<Ticket | null>;  
  declare transactions: NonAttribute<Transaction[]>;

  declare typeName: NonAttribute<string>;
  declare lastDrawDate: NonAttribute<string>;
  declare winningResult: NonAttribute<string>;

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;

  declare static associations: {
    lottery: Association<Order, Lottery>;
    ticket: Association<Order, Ticket>;
    transactions: Association<Order, Transaction>;
  };

  getTicketStatus()
  {
    let status = 'active';
    if (!this.prize) {
      status = 'active';
    } else {
      if (this.type == OrderType.SINGLE
        || this.type == OrderType.SINGLE_AUTO ) {
        if (!this.ticket && this.prize === 0) {
          status = 'inActive';
        }
      } else if (this.type === OrderType.GROUP) {
        if (this.prize === 0) {
          status = 'inActive';
        }
      }
    }

    return status;
  }
}

Order.init(
  {
    ...SequelizeAttributes.Order, 
    typeName: {
      type: DataTypes.VIRTUAL,
      get(): string {
        if (this.type === OrderType.SINGLE) {
          return 'SINGLE';
        } else if (this.type === OrderType.SINGLE_AUTO) {
          return 'SINGLE-AUTO';
        } else if (this.type === OrderType.GROUP) {
          return 'GROUP';
        } else {
          return 'VIP';
        }
      }
    },
    lastDrawDate: {
      type: DataTypes.VIRTUAL,
      get(): string {
        return moment.unix(this.drawDayCurrent).format();
      }
    },
    winningResult: {
      type: DataTypes.VIRTUAL,
      get(): string {
        let ret = 'Pending';
        if (this.prize && this.prize > 0) {
          ret = `₦${this.prize}`;
        } else {
          if (this.getTicketStatus() == 'inActive') {
            ret = 'UNLUCKY';
          }
        }
        return ret;
      }
    }
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'order',
  }
)

// Lottery.hasMany(Order, {
//   foreignKey: 'idLottery',
//   sourceKey: 'id',
// })
// Order.belongsTo(Lottery, {
//   foreignKey: 'idLottery',
//   targetKey: 'id',
// });

// Order.belongsTo(Ticket, {
//   foreignKey: 'idTicket',
//   targetKey: 'id',
// });

// Order.hasMany(Draw, {
//   sourceKey: 'idTicket',
//   foreignKey: 'idTicket',
// });


Order.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idOrder',
  as: 'transactions',
});

Transaction.belongsTo(Order, {
  targetKey: 'id',
  foreignKey: 'idOrder',
  as: 'order',
  constraints: false,
});

export default Order;