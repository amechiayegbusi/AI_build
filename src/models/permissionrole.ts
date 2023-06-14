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

class PermissionRole extends Model<InferAttributes<PermissionRole>, InferCreationAttributes<PermissionRole>> {
  declare id: CreationOptional<number>;

  declare permissionId: number | null;

  declare roleId: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

PermissionRole.init(
  {
    ...SequelizeAttributes.PermissionRole,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'PermissionRole',
  }
);

export default PermissionRole;
