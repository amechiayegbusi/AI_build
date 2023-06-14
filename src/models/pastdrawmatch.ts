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

class Pastdrawmatch extends Model<InferAttributes<Pastdrawmatch>, InferCreationAttributes<Pastdrawmatch>> {
  declare id: CreationOptional<number>;

  declare idPastDraw: number | null;

  declare match: string | null;

  declare prize: number | null;

  declare total: number | null;

  declare regional: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare payout?: number | null;
}

Pastdrawmatch.init(
  {
    ...SequelizeAttributes.Pastdrawmatches,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Pastdrawmatches',
  }
);

export default Pastdrawmatch;
