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

class Timezone extends Model<InferAttributes<Timezone>, InferCreationAttributes<Timezone>> {
  declare id: CreationOptional<number>;

  declare value: string | null;

  declare abbr: string | null;

  declare offset: number | null;

  declare isdst: number | null;

  declare text: string | null;

  declare utc: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

Timezone.init(
  {
    ...SequelizeAttributes.Timezone,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'timezone',
  }
);

export default Timezone;
