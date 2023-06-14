import SequelizeAttributes from 'utils/SequelizeAttributes';
import { getLotteryImgPath } from 'utils/Asset';
import moment from 'moment';

import db from './_instance';
import GroupUser from './groupuser';
import Ticket from './ticket';

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,  
} from 'sequelize';
import Lottery from './lottery';

class GroupLottery extends Model<InferAttributes<GroupLottery>, InferCreationAttributes<GroupLottery>> {
  declare id: CreationOptional<number>;
  declare idLottery: number;
  declare drawDay: number;
  declare shares: number;
  declare pricePerShares: number;
  declare ticketCount: number;
  declare active: number;

  declare lottery: NonAttribute<Lottery | null>;
  declare groupUsers: NonAttribute<GroupUser[]>;
  declare tickets: NonAttribute<Ticket[]>;
  declare lotteryTitle: NonAttribute<string>;
  declare lotteryName: NonAttribute<string>;
  declare ballImgUrl: NonAttribute<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  getRemainShares(): number {
    let userShares = 0;
    this.groupUsers.forEach(guser => {
      userShares += guser.shares;
    });

    return this.shares - userShares;
  }

  isAlreadyPlayed(userId: number): boolean {
    this.groupUsers.forEach(guser => {
      if (guser.idUser === userId) {
        return true;
      }
    });
    return false;
  }

  getUserShares(userId: number): number {
    this.groupUsers.forEach(guser => {
      if (guser.idUser === userId) {
        return guser.shares;
      }
    });
    
    return 0;
  }

  getDateUp(): string {
    return moment(this.createdAt).add(1, 'hour').format();
  }

  getDateNormalized(): string | null {
    if (this.drawDay) {
      return moment(this.drawDay).format();
    }

    return null;
  }
}

GroupLottery.init(
  {
    ...SequelizeAttributes.GroupLottery,
    lotteryTitle: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.lottery?.caption;
      }
    },
    lotteryName: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.lottery?.name;
      }
    },
    ballImgUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        return getLotteryImgPath(this.lottery?.name!, 'ball');
      }
    },
    isPlayed: {
      type: DataTypes.VIRTUAL,
      get() {
        const userId = 0;
        return this.isAlreadyPlayed(userId);
      }
    }
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'grouplottery',
  }
);

Lottery.hasMany(GroupLottery, {
  foreignKey: 'idLottery',
  sourceKey: 'id',
})

GroupLottery.belongsTo(Lottery, {
  foreignKey: 'idLottery',
  targetKey: 'id',
  constraints: false,
});

GroupLottery.hasMany(GroupUser, {
  sourceKey: 'id',
  foreignKey: 'idGroup',
  as: 'groupUsers',
});

GroupUser.belongsTo(GroupLottery, {
  foreignKey: 'idGroup',
  targetKey: 'id',
  as: 'groupLottery',
  constraints: false,
});

GroupLottery.hasMany(Ticket, {
  sourceKey: 'id',
  foreignKey: 'idGroup',
  as: 'tickets',
});

Ticket.belongsTo(GroupLottery, {
  targetKey: 'id',
  foreignKey: 'idGroup',
  as: 'groupLottery',
  constraints: false,
});

export default GroupLottery;