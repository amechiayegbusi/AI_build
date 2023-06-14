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

class Playwinsetting extends Model<InferAttributes<Playwinsetting>, InferCreationAttributes<Playwinsetting>> {
  declare id: CreationOptional<number>;

  declare prize: number | null;

  declare idManager: number | null;

  declare nextDrawDate: Date | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

Playwinsetting.init(
  {
    ...SequelizeAttributes.Playwinsetting,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'playwinsetting',
  }
);

export default Playwinsetting;
