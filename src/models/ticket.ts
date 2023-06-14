import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
  DataTypes,
  Op,
  FindOptions,
  Attributes,  
} from 'sequelize';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import { getLotteryImgPath } from 'utils/Asset';
import db from './_instance';
import Draw from './draw';
import GroupLottery from './grouplottery';
import GroupUser from './groupuser';
import Lottery from './lottery';
import Playwin from './playwin';
import Transaction from './transaction';
import User from './user';

class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> {
  declare id: string;

  declare idContentfulGame: string | null;

  declare duration: number | null;

  declare random: number | null;

  declare multiplier: number | null;

  declare mainNumbers: string | null;

  declare bonusNumbers: string | null;

  declare count: number | null;

  declare pricePerTicket: number | null;

  declare idUser: number | null;

  declare idGame: number | null;

  declare idGroup: number | null;

  declare idVipcomb: number | null;

  declare idTransaction: number | null;

  declare idAgent: number | null;

  declare idTerminal: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare draws: NonAttribute<Draw[]>;

  declare groupLottery: NonAttribute<GroupLottery | null>;

  declare lottery: NonAttribute<Lottery | null>;

  declare transaction: NonAttribute<Transaction | null>;

  declare user: NonAttribute<User | null>;

  declare ticketImgUrl: NonAttribute<string | null>;

  declare lotteryTitle: NonAttribute<string | null>;

  declare lotterySlug: NonAttribute<string | null>;

  declare createdAtUp: NonAttribute<Date | null>;

  declare static associations: {
    draws: Association<Ticket, Draw>;
    groupLottery: Association<Ticket, GroupLottery>;
    lottery: Association<Ticket, Lottery>;    
    transaction: Association<Transaction, Lottery>;
    user: Association<Ticket, User>;
  };

  getPrize = async (idGroupLottery: number | null, idUser: number | null): Promise<number> => {
    let prize = 0;

    if (!idGroupLottery && this.idGroup) {   // Group Ticket
      const tickets = await Ticket.findAll({
        include: [{ model: Draw, as: 'draws', required: true }],
        where: { idGroup: this.idGroup }
      });
      tickets.forEach(eachTicket => {
        eachTicket.draws.forEach(eachDraw => {
          if (eachDraw.prize)
            prize += eachDraw.prize;
        });
      });

      const groupUser = await this.getGroupUser(idUser);
      if (!groupUser)
        prize = 0;
      else {
        if (this.groupLottery) {
          prize = Math.floor(prize * (groupUser.shares / this.groupLottery.shares));
        }
      }
    } else {
      this.draws.forEach(eachDraw => {
        if (eachDraw.prize)
          prize += eachDraw.prize;
      });
    }

    return prize;
  }

  getGroupUser = async (idUser: number | null): Promise<GroupUser | null> => {
    if (this.idGroup && idUser) {
      const groupUser = await GroupUser.findOne({
        where: {
          idGroup: this.idGroup,
          idUser: idUser
        }
      });

      return groupUser;
    }

    return null;
  }

  getDraws = async (): Promise<Draw[]> => {
    const draws = await Draw.findAll({
      where: {
        idTicket: this.id
      }
    });

    return draws;
  }

  getLastDraw = async (): Promise<Draw | null> => {
    const draws = await Draw.findAll({
      where: {
        idTicket: this.id
      },
      order: [
        ['drawDay', 'DESC'],
      ]
    });

    if (draws.length > 0)
      return draws[0];

    return null;
  }

  getLastDrawDate = async (): Promise<number | null> => {
    const lastDraw = await this.getLastDraw();
    if (!lastDraw)
      return null;

    return lastDraw.drawDay;
  }

  getUser = async (): Promise<User | null> => {
    if (this.idUser) {
      const user = await User.findByPk(this.idUser);
      return user;
    }

    return null;
  }

  getWaitingForResults = async (): Promise<number> => {
    const count = await Draw.count({
      where: {
        idTicket: this.id,
        prize: {
          [Op.is]: null
        }
      }
    });

    return count;
  }

  getToPlay = async (): Promise<number> => {
    const count = this.count;
    const waitingForResults = await this.getWaitingForResults();

    if (!count)
      return waitingForResults;

    return count + waitingForResults;
  }

  getActive = async (): Promise<boolean> => {
    const toPlay = await this.getToPlay();
    return toPlay > 0;
  }

  getMainNumbers = (): any => {
    if (Array.isArray(this.mainNumbers))
      return this.mainNumbers;
    else
      return JSON.parse(!this.mainNumbers ? '' : this.mainNumbers);
  }

  getBonusNumbers = (): any => {
    if (Array.isArray(this.bonusNumbers))
      return this.bonusNumbers;
    else
      return JSON.parse(!this.bonusNumbers ? '' : this.bonusNumbers);
  }

  getPricePerTicket = async (idGroupLottery: number | null, idUser: number | null): Promise<number | null> => {
    let pricePerTicket = 0;
    if (!idGroupLottery || this.idGroup) {    // Group Agent Ticket
      const groupUser = await this.getGroupUser(idUser);      
      if (groupUser && this.groupLottery)
        pricePerTicket = groupUser.shares * this.groupLottery.pricePerShares;
      else
        pricePerTicket = 0;
    } else {
      pricePerTicket = this.pricePerTicket as number;
    }

    return pricePerTicket;
  }

  getNumbers = async (idGroupLottery: number | null, idUser: number | null): Promise<string | null> => {
    let numbers = '';
    if (!idGroupLottery && this.idGroup) {    // Group Agency Ticket
      numbers = 'GROUP-' + this.idGame + '0' + this.idGroup;
    } else {
      let mainNum = null;
      if (!Array.isArray(this.mainNumbers))
        mainNum = JSON.parse(!this.mainNumbers ? '' : this.mainNumbers);
      else
        mainNum = this.mainNumbers;

      let bonusNum = null;
      if (!Array.isArray(this.bonusNumbers))
        bonusNum = JSON.parse(!this.bonusNumbers ? '' : this.bonusNumbers);
      else
        bonusNum = this.bonusNumbers;

      if (Array.isArray(mainNum))
        numbers = mainNum.join(',');
      else
        numbers = mainNum;

      numbers += ' ';

      if (Array.isArray(bonusNum))
        numbers += bonusNum.join(',');
      else
        numbers += bonusNum;
    }

    return numbers;
  }

  getShares = async (idGroupLottery: number | null, idUser: number | null): Promise<number | null> => {
    if (!idGroupLottery && this.idGroup) {    // Group Agency Ticket
      const groupUser = await this.getGroupUser(idUser);
      if (groupUser)
        return groupUser.shares;
      
      return 0;
    }

    return 0;
  }

  static getUserTickets = async (onlyActive: boolean = false, idUser: number = 0, idLottery: number = 0): Promise<Ticket[]> => {
    let findOptions: FindOptions<Attributes<Ticket>> = {
      where: {
        idUser: idUser,
        idGame: idLottery,
      }
    };

    if (onlyActive) {
      findOptions.where = {
        ...findOptions.where,
        count: {
          [Op.gt]: 0
        }
      };
    } else {
      findOptions.where = {
        ...findOptions.where,
        count: {
          [Op.gte]: 0
        }
      };
    }

    const userTickets = await Ticket.findAll(findOptions);

    return userTickets;
  }

  static getActiveTickets = async (): Promise<Ticket[]> => {
    const activeTickets = await Ticket.findAll({
      where: {
        count: {
          [Op.gt]: 0
        }
      }
    });

    return activeTickets;
  }

  static getTicketDraws = async (idTicket: number | null): Promise<Draw[]> => {
    let ticketsDraws: Draw[] = [];
    if (!idTicket)
      return [];

    const ticket = await Ticket.findByPk(idTicket);
    if (ticket === null || !ticket)
      return [];

    const draws = await ticket.getDraws();
    if (!draws || draws.length === 0)
      return [];

    // pending ...
    // draws.forEach(eachDraw => {
    //   const updated: Draw | null = eachDraw.getCustomDraw(eachDraw.id);
    //   if (updated) {
    //     updated.mainNumbersPlayed = JSON.parse(!updated.mainNumbersPlayed ? '' : updated.mainNumbersPlayed);
    //     updated.bonusNumbersPlayed = JSON.parse(!updated.bonusNumbersPlayed ? '' : updated.bonusNumbersPlayed);

    //     ticketsDraws.push(updated);
    //   }
    // });

    return ticketsDraws;
  }

  static getTicketDrawsScan = async (idTicket: number | null): Promise<Draw[]> => {
    let ticketsDrawScans: Draw[] = [];

    if (!idTicket)
      return [];

    const ticket = await Ticket.findByPk(idTicket);
    if (ticket === null || !ticket)
      return [];

    const draws = await ticket.getDraws();
    if (!draws || draws.length === 0)
      return [];

    // pending ...
    // draws.forEach(eachDraw => {
    //   const updated: Draw | null = eachDraw.getCustomScan(eachDraw.id);
    //   if (updated) {
    //     ticketsDrawScans.push(updated);
    //   }
    // });

    return ticketsDrawScans;
  }
}

Ticket.init(
  {
    ...SequelizeAttributes.Ticket,
    ticketImgUrl: {
      type: DataTypes.VIRTUAL,
      get(): string | null {
        if (!this.lottery)
          return null;

        return getLotteryImgPath(this.lottery.name, 'logo');
      }
    },
    lotteryTitle: {
      type: DataTypes.VIRTUAL,
      get(): string | null {
        if (!this.lottery)
          return null;

        return this.lottery.caption;
      }
    },
    lotterySlug: {
      type: DataTypes.VIRTUAL,
      get(): string | null {
        if (!this.lottery)
          return null;

        return this.lottery.name;
      }
    },
    createdAtUp: {
      type: DataTypes.VIRTUAL,
      get(): Date | null {
        if (!this.createdAt)
          return null;

        const newDate = new Date(this.createdAt);
        newDate.setHours(newDate.getHours() + 1);

        return newDate;
      }
    }
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'ticket',
    hooks: {
      afterValidate: async (ticket: Ticket, options) => {
        if (Array.isArray(ticket.mainNumbers))
          ticket.mainNumbers = JSON.stringify(ticket.mainNumbers);

        if (Array.isArray(ticket.bonusNumbers))
          ticket.bonusNumbers = JSON.stringify(ticket.bonusNumbers);
      },
      afterUpdate: async (ticket: Ticket, options) => {
        if (ticket.count == 0) {
          // ticket.user
        }
      },
    }
  }
);

Ticket.hasOne(Playwin, {
  sourceKey: 'id',
  foreignKey: 'idTicket',
  as: 'playwin',
});

Playwin.belongsTo(Ticket, {
  targetKey: 'id',
  foreignKey: 'idTicket',
  as: 'ticket',
  constraints: false,
});

Ticket.hasMany(Draw, {
  sourceKey: 'id',
  foreignKey: 'idTicket',
  as: 'draws',
});

Draw.belongsTo(Ticket, {
  targetKey: 'id',
  foreignKey: 'idTicket',
  as: 'ticket',
  constraints: false,
});

export default Ticket;
