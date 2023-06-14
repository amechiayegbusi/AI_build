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

class Voucherlottery extends Model<InferAttributes<Voucherlottery>, InferCreationAttributes<Voucherlottery>> {
  declare id: CreationOptional<number>;

  declare idVoucher: number | null;

  declare idLottery: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

Voucherlottery.init(
  {
    ...SequelizeAttributes.Voucherlottery,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Voucherlottery',
  }
);

export default Voucherlottery;
