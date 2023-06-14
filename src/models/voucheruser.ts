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
import Voucher from './voucher';

class Voucheruser extends Model<
  InferAttributes<Voucheruser, { omit: 'voucher' | 'remainUsageCount' | 'dateUp' | 'startDateUp' | 'endDateUp' | 'isAvailable' | 'code' | 'moneyType' | 'amount' | 'title' | 'description' }>,
  InferCreationAttributes<Voucheruser, { omit: 'voucher' | 'remainUsageCount' | 'dateUp' | 'startDateUp' | 'endDateUp' | 'isAvailable' | 'code' | 'moneyType' | 'amount' | 'title' | 'description' }>
> {
  declare id: CreationOptional<number>;

  declare idVoucher: number | null;

  declare idUser: number | null;

  declare status: number | null;

  declare usageCount: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare transactions: NonAttribute<Transaction[]>;

  declare voucher?: NonAttribute<Voucher> | null;

  declare static associations: {
    transactions: Association<Voucheruser, Transaction>;
    voucher: Association<Voucheruser, Voucher>;
  };

  get remainUsageCount(): NonAttribute<number> {
    if (!this.voucher)
      return 0;

    if (!this.voucher.usageCount)
      return 0;

    if (!this.usageCount)
      return this.voucher.usageCount;

    return this.voucher.usageCount - this.usageCount;
  }

  get dateUp(): NonAttribute<Date | null> {
    if (!this.createdAt)
      return null;

    const newDate = new Date(this.createdAt);
    newDate.setHours(newDate.getHours() + 1);

    return newDate;
  }

  get startDateUp(): NonAttribute<Date | null> {
    if (!this.voucher)
      return null;

    if (!this.voucher.startDate)
      return null;

    const newDate = new Date(this.voucher.startDate);
    newDate.setHours(newDate.getHours() + 1);

    return newDate;
  }

  get endDateUp(): NonAttribute<Date | null> {
    if (!this.voucher)
      return null;

    if (!this.voucher.endDate)
      return null;

    const newDate = new Date(this.voucher.endDate);
    newDate.setHours(newDate.getHours() + 1);

    return newDate;
  }

  get isAvailable(): NonAttribute<boolean> {
    if (this.remainUsageCount <= 0)
      return false;

    return true;
  }
  
  get code(): NonAttribute<string | null> {
    if (!this.voucher)
      return null;

    return this.voucher.code;
  }

  get moneyType(): NonAttribute<number | null> {
    if (!this.voucher)
      return null;

    return this.voucher.moneyType;
  }

  get amount(): NonAttribute<number | null> {
    if (!this.voucher)
      return null;

    return this.voucher.amount;
  }

  get title(): NonAttribute<string | null> {
    if (!this.voucher)
      return null;

    return this.voucher.title;
  }

  get description(): NonAttribute<string | null> {
    if (!this.voucher)
      return null;

    return this.voucher.description;
  }
}

Voucheruser.init(
  {
    ...SequelizeAttributes.Voucheruser,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Voucheruser',
  }
);

Voucheruser.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idVoucherUser',
  as: 'transactions',
});

Transaction.belongsTo(Voucheruser, {
  targetKey: 'id',
  foreignKey: 'idVoucherUser',
  as: 'voucherUser',
  constraints: false,
});

export default Voucheruser;
