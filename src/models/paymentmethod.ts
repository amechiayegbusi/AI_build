import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
} from 'sequelize';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import db from './_instance';
import Transaction from './transaction';
import User from './user';

const TYPE_VIRTUAL = 'virtual';
const TYPE_BONUS = 'bonus';
const TYPE_PRIZE = 'prize';

class Paymentmethod extends Model<
  // eslint-disable-next-line no-use-before-define
  InferAttributes<Paymentmethod>,
  // eslint-disable-next-line no-use-before-define
  InferCreationAttributes<Paymentmethod>
> {
  declare id: CreationOptional<number>;

  declare userId: number | null;

  declare type: string | null;

  declare info: string | null;

  declare balance: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare transactions?: NonAttribute<Transaction[]> | null;

  declare user?: NonAttribute<User> | null;

  declare static associations: {
    transactions: Association<Paymentmethod, Transaction>;
    user: Association<Paymentmethod, User>;    
  };

  static getVirtualAccount = async (idUser: number): Promise<Paymentmethod | null> => {
    const ret = await Paymentmethod.findOne({
      where: { userId: idUser, type: TYPE_VIRTUAL },
    });

    return ret;
  };

  static getBonusAccount = async (idUser: number): Promise<Paymentmethod | null> => {
    const ret = await Paymentmethod.findOne({
      where: { userId: idUser, type: TYPE_BONUS },
    });

    return ret;
  };

  static getPrizeAccount = async (idUser: number): Promise<Paymentmethod | null> => {
    const ret = await Paymentmethod.findOne({
      where: { userId: idUser, type: TYPE_PRIZE },
    });

    return ret;
  };
}

Paymentmethod.init(
  {
    ...SequelizeAttributes.Paymentmethod,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Paymentmethod',
  }
);

Paymentmethod.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idPaymentMethod',
  as: 'transactions',
});

Transaction.belongsTo(Paymentmethod, {
  targetKey: 'id',
  foreignKey: 'idPaymentMethod',
  as: 'paymentmethod',
  constraints: false,
});

export default Paymentmethod;
