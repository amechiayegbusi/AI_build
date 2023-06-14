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

class SmsVerify extends Model<InferAttributes<SmsVerify>, InferCreationAttributes<SmsVerify>> {
  declare id: CreationOptional<number>;

  declare phone: string | null;

  declare code: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare deletedAt: CreationOptional<Date>;
}

SmsVerify.init(
  {
    ...SequelizeAttributes.SmsVerify,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'sms_verify',
  }
);

export default SmsVerify;
