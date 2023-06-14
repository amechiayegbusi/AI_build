import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
  DataTypes,
} from 'sequelize';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import db from './_instance';
import Lottery from './lottery';
import Playwinsetting from './playwinsetting';
import Ticket from './ticket';
import User from './user';

class Playwin extends Model<InferAttributes<Playwin>, InferCreationAttributes<Playwin>> {
  declare id: CreationOptional<number>;

  declare idTicket: string | null;

  declare prize: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare deletedAt: CreationOptional<Date>;

  declare ticket: NonAttribute<Ticket | null>;

  declare lottery: NonAttribute<Lottery | null>;

  declare user: NonAttribute<User | null>;

  declare static associations: {
    ticket: Association<Playwin, Ticket>;
    lottery: Association<Playwin, Lottery>;
    user: Association<Playwin, User>;
  };

  get dateUp(): NonAttribute<Date | null> {
    if (!this.createdAt)
      return null;

    const newDate = new Date(this.createdAt);
    newDate.setHours(newDate.getHours() + 1);

    return newDate;
  }

  getPlayWinSetting = async(): Promise<Playwinsetting | null> => {
    const playwinSetting = await Playwinsetting.findByPk(1);
    return playwinSetting;
  }

  getNextDrawDateUp = async(): Promise<Date | null> => {
    const playwinSetting = await this.getPlayWinSetting();
    if (!playwinSetting)
      return null;

    if (!playwinSetting.nextDrawDate)
      return null;

    const newDate = new Date(playwinSetting.nextDrawDate);
    newDate.setHours(newDate.getHours() + 1);

    return newDate;
  }
}

Playwin.init(
  {
    ...SequelizeAttributes.Playwin,
    lottery: {
      type: DataTypes.VIRTUAL,
      get(): Lottery | null {
        if (!this.ticket)
          return null;

        return this.ticket.lottery;
      }
    },
    user: {
      type: DataTypes.VIRTUAL,
      get(): User | null {
        if (!this.ticket)
          return null;

        return this.ticket.user;
      }
    },
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'playwin',
  }
);

export default Playwin;
