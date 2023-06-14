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
// import Card from './card';
import Transaction from './transaction';

class Paymentmethodconfig extends Model<InferAttributes<Paymentmethodconfig>, InferCreationAttributes<Paymentmethodconfig>> {
  declare id: CreationOptional<number>;

  declare logo: string | null;

  declare name: string | null;

  declare label: string | null;

  declare link: string | null;

  declare config: string | null;

  declare status: number | null;

  declare acaptureMethod: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare transactions?: NonAttribute<Transaction[]> | null;

  declare static associations: {
    transactions: Association<Paymentmethodconfig, Transaction>;
  };
}

Paymentmethodconfig.init(
  {
    ...SequelizeAttributes.Paymentmethodconfig,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'paymentmethodconfig',
  }
);

/* Paymentmethodconfig.hasMany(Card, {
  sourceKey: 'id',
  foreignKey: 'idPaymentMethodConfig',
  as: 'cards',
}); */

Paymentmethodconfig.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idPaymentMethodConfig',
  as: 'transactions',
});

Transaction.belongsTo(Paymentmethodconfig, {
  targetKey: 'id',
  foreignKey: 'idPaymentMethodConfig',
  as: 'paymentMethodConfig',
  constraints: false,
});

export default Paymentmethodconfig;
