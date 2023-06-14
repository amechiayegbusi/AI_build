import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';

import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional
} from 'sequelize';
import { Status } from 'constants/ConstCountry';

class Country extends Model<InferAttributes<Country>, InferCreationAttributes<Country>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare shortName: string;
  declare code: string;
  declare status: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

Country.init(
  {
    ...SequelizeAttributes.Country,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'country',
    scopes: {
      allowed: {
        where: {
          status: Status.ACTIVE,
        }
      }
    }
  }
);

export default Country;