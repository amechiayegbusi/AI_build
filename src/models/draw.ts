import SequelizeAttributes from 'utils/SequelizeAttributes'
import moment from 'moment';

import Ticket from './ticket';
import Pastdraw from './pastdraw';
import Paymentmethod from './paymentmethod';
import Transaction from './transaction';
import Currency from './currency';
import Lottery from './lottery';
import GroupLottery from './grouplottery';
import GroupUser from './groupuser';
import Order from './order';
import * as LtechService from '../services/LtechService';

import db from './_instance';

import { OrderStatus } from 'constants/ConstOrder';
import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from 'constants/ConstTransaction';

class Draw extends Model<InferAttributes<Draw>, InferCreationAttributes<Draw>> {
  declare id: CreationOptional<number>;
  declare idTicket: string;
  declare idTransaction: number;
  declare token: string;
  declare date: Date;
  declare mainNumbersPlayed: any;
  declare bonusNumbersPlayed: any;
  declare prize: number | null;
  declare drawDayLtech: number;
  declare drawDay: number;
  declare scan: string | null;
  declare number: number;

  declare ticket: NonAttribute<Ticket | null>;
  declare transactions: NonAttribute<Transaction[]>;

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;

  getWinningNumbers = async (): Promise<Pastdraw | null> => {
    let ret = await Pastdraw.findOne({
      where: {
        idLottery: this.ticket?.idGame,
        date: this.drawDayLtech,
      }
    });

    if (!ret || !ret.bonusNumbers) return ret;

    let bonusNum = JSON.parse(ret.bonusNumbers);
    let plus = bonusNum.plus;
    ret.bonusNumbers = plus;

    return ret;
  }

  /* static hasDrawsForDate(draws: Draw[], date: string): boolean {
    if (!date) {
      date = moment().format('YYYY/DD/MM');
    }

    for (let i = 0; i < draws.length; i++) {
      let draw = draws[i];
      if (moment(draw.drawDay).format('YYYY/MM/DD') === date) {
        return true;
      }
    }

    return false;
  }
  
  getCustomScan = async (idDraw: number) => {
    let draw = await Draw.findOne({
      where: {
        id: idDraw,
        scan: null
      }
    });

    if (draw) {
      if (draw.scan) {
        return draw;
      } else {
        let lottoDraw = await LtechService.getOrderedTicket(draw.token);
        //update scan
        if (lottoDraw.scan) {
          draw.scan = lottoDraw.scan;
          draw.save();
          return draw;
        }
      }
    }

    return false;
  } */
}

Draw.init(
  {
    ...SequelizeAttributes.Draw,
    mainNumbersPlayed: {
      type: DataTypes.STRING(255),
      get(this: Draw): object {
        const rawValue = this.getDataValue('mainNumbersPlayed');
        return JSON.parse(rawValue);
      }
    },
    bonusNumbersPlayed: {
      type: DataTypes.STRING(255),
      get(this: Draw): object {
        const rawValue = this.getDataValue('bonusNumbersPlayed');
        return JSON.parse(rawValue);
      }
    },
    scan: {
      type: DataTypes.STRING(255),
      get(this: Draw): string {
        const rawValue = this.getDataValue('scan');
        return rawValue ? rawValue : '';
      }
    }
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'draw',
    hooks: {
      beforeCreate: async (draw, option) => {
        if (draw.prize) {

        } else {
          let ticket = await Ticket.findOne({
            where: {
              id: draw.idTicket
            }
          });

          if (!ticket) return;

          let prizePaymentMethod = await Paymentmethod.getPrizeAccount(ticket.idUser!);

          if (prizePaymentMethod && draw.prize && draw.prize > 0) {
            let order = await Order.findOne({
              where: {
                idTicket: ticket.id,
                status: OrderStatus.ORDERED
              }
            });

            let data: any = {
              idUser: ticket.idUser,
              idPaymentMethod: prizePaymentMethod.id,
              type: TRANSACTION_TYPE.TYPE_PRIZE,
              amount: draw.prize,
              date: moment().unix(),
              idLottery: ticket.idGame,
              idDraw: draw.id,
              idOrder: order?.id,
              status: TRANSACTION_STATUS.STATUS_SUCCESS,
            };

            if (order?.idAgent) {
              data = {
                ...data,
                idAgent: order?.idAgent,
                idTerminal: order?.idTerminal,
              };
            }

            let transaction = await Transaction.create(data);
            if (transaction) {
              if (order) {
                order.prize += draw.prize!;                
                order.save();
              }
            } else {
              let error = 'Prize error';
            }
          }
        }
      }
    }
  }
);

Draw.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idDraw',
  as: 'transactions',
});

Transaction.belongsTo(Draw, {
  targetKey: 'id',
  foreignKey: 'idDraw',
  as: 'draw',
});

export default Draw;