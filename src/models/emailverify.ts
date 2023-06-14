import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';
import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional
} from 'sequelize';

class EmailVerify extends Model<InferAttributes<EmailVerify>, InferCreationAttributes<EmailVerify>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare code: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

EmailVerify.init(
  {
    ...SequelizeAttributes.EmailVerify,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'email_verify',
  }
);

export default EmailVerify;