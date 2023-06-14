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

class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id: CreationOptional<number>;

  declare parent_id: number | null;

  declare name: string | null;

  declare description: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

Permission.init(
  {
    ...SequelizeAttributes.Permissions,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Permissions',
  }
);

export default Permission;
