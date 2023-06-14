import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';
import GroupLottery from './grouplottery';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import moment from 'moment';

class GroupUser extends Model<InferAttributes<GroupUser>, InferCreationAttributes<GroupUser>> {
  declare id: CreationOptional<number>;
  declare idUser: number;
  declare idGroup: number;
  declare shares: number;
  declare idTransaction: number;

  declare groupLottery: NonAttribute<GroupLottery | null>;
  declare dateUp: NonAttribute<string>;

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

GroupUser.init(
  {
    ...SequelizeAttributes.GroupUser,
    dateUp: {
      type: DataTypes.VIRTUAL,
      get(): string {
        return moment(this.createdAt).add(1, 'hours').format();
      }
    }
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'groupuser',
  }
);

export default GroupUser;