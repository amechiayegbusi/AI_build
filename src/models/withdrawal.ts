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
import Transaction from './transaction';

class Withdrawal extends Model<
  InferAttributes<Withdrawal, { omit: 'idUser' | 'transactionAmount' | 'status' | 'amount' }>,
  InferCreationAttributes<Withdrawal, { omit: 'idUser' | 'transactionAmount' | 'status' | 'amount' }>
> {
  declare id: CreationOptional<number>;

  declare accountName: string | null;

  declare accountNumber: string | null;

  declare bankName: string | null;

  declare idAdmin: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare transaction?: NonAttribute<Transaction | null>;

  declare static associations: {
    transaction: Association<Withdrawal, Transaction>;
  }

  get idUser(): NonAttribute<number | null> {
    if (this.transaction === null || !this.transaction)
      return null;

    if (this.transaction.paymentmethod === null || !this.transaction.paymentmethod)
      return null;

    return this.transaction.paymentmethod.userId;
  }

  get transactionAmount(): NonAttribute<number | null> {
    if (this.transaction === null || !this.transaction)
      return 0;

    return this.transaction.amount;
  }

  get status(): NonAttribute<string | null> {
    if (this.transaction === null || !this.transaction)
      return '';

    return this.transaction.status;
  }

  get amount(): NonAttribute<number | null> {
    if (this.transaction === null || !this.transaction)
      return 0;

    return this.transaction.amount;
  }
}

Withdrawal.init(
  {
    ...SequelizeAttributes.Withdrawal,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'withdrawal',
    hooks: {
      beforeSave: (withdrawal: Withdrawal, options) => {
        // pending ...
      },
      afterSave: (withdrawal: Withdrawal, options) => {
        // pending ...
      },
    },
  }
);

Withdrawal.hasOne(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idWithdrawal',
  as: 'transaction',
});

Transaction.belongsTo(Withdrawal, {
  targetKey: 'id',
  foreignKey: 'idWithdrawal',
  as: 'withdrawal',
  constraints: false,
});

export default Withdrawal;
