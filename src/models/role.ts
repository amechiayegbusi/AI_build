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

class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<number>;

  declare name: string | null;

  declare description: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

Role.init(
  {
    ...SequelizeAttributes.Roles,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Roles',
  }
);

export default Role;
