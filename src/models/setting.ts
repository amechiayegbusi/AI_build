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

class Setting extends Model<InferAttributes<Setting>, InferCreationAttributes<Setting>> {
  declare id: CreationOptional<number>;

  declare key: string | null;

  declare value: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

Setting.init(
  {
    ...SequelizeAttributes.Settings,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Settings',
  }
);

export default Setting;
