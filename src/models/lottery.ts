import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';
import Currency from './currency';
import { SingleStatus } from '../constants/ConstLottery';

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  QueryTypes,
  Op,
  Association,
} from 'sequelize';
import { renameTables } from 'utils/SequeliceMigration';
import { getLotteryImgPath } from 'utils/Asset';
import moment from 'moment';
import { retail_v2 } from 'googleapis';
import Ticket from './ticket';
import LotteryPrice from './lotteryprice';
import Pastdraw from './pastdraw';
import User from './user';
import Draw from './draw';
import { USER_STATUS } from 'constants/ConstUser';
import Vipcombo from './vipcombo';

class Lottery extends Model<InferAttributes<Lottery>, InferCreationAttributes<Lottery>> {
  declare id: CreationOptional<number>;
  declare idContentfulGame: string;
  declare name: string;
  declare link: string;
  declare caption: string;
  declare enabled: number;
  declare jackpot: number;
  declare numberMax: number;
  declare numberCount: number;
  declare bonusMin: number;
  declare bonusMax: number;
  declare bonusNumCount: number;
  declare nextDrawTime: number;
  declare startBuingTime: number;
  declare endBuingTime: number;
  declare currency: string;
  declare cutOffTime: string;
  declare cutOffTimeSat: string;
  declare drawDays: string;
  declare pow: string;
  declare backgroundImgUrl: string;
  declare groupEnabled: number;
  declare gTickets: number;
  declare gDefaultTickets: number;
  declare gShares: number;
  declare gDefaultShares: number;
  declare gSharePrice: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare jackpotCorrected: NonAttribute<number>;

  declare lotteryPrices?: NonAttribute<LotteryPrice[]>;

  declare static associations: {
    lotteryPrices: Association<Lottery, LotteryPrice>;
  };

  /**
   * 
   * @param count 
   * @param startdate 
   * @param normalize 
   * @param offset 
   * @returns 
   */
  planForLottery(
    count: number = 1,
    startdate: number | null = null,
    normalize = false,
    offset = 0
    )
  {
    if (!startdate) {
      startdate = moment().unix();
    }
    
    let plan = [];
    let lastDate = moment.unix(startdate).unix(); // drop time
    for (let i = 0; i < count; i++) {
      let ret = this.findNearestDrawDate(lastDate, normalize, offset);
      if (typeof ret === 'number')
        plan.push(moment(ret).format());
    }
    return plan;
  }

  /**
   * 
   * @param count 
   * @param startdate 
   * @param normalize 
   * @param offset 
   * @returns 
   */
  planForLotteryWithInt(
    count = 1,
    startdate: number | null = null,
    normalize = false,
    offset = 0
    )
  {
    if (!startdate) {
      startdate = moment().unix();
    }
    
    let plan = [];
    let lastDate: number = moment.unix(startdate).unix(); // drop time
    for (let i = 0; i < count; i++) {
      let ret = this.findNearestDrawDate(lastDate, normalize, offset);
      plan.push(ret);
    }
    return plan;
  }

  getPlan()
  {
    return this.planForLottery();
  }

  /**
   * 
   * @param from 
   * @param normalize 
   * @param offset 
   * @returns 
   */
  findNearestDrawDate = async (from: number, normalize = false, offset = 0): Promise<number | boolean> =>  {
    let drawDays = this.drawDays ? JSON.parse(this.drawDays) : [];
    if (drawDays) {
      let day = from + offset * 3600;
      let t;
      do {
        day += (3600 * 24);
        t = moment(normalize ? (await this.normalizeDrawDate(day, true)) : day).format('E');
      } while (!drawDays.includes(t));

      return normalize ? (await this.normalizeDrawDate(day)) : moment.unix(day).unix();
    }
    return false;
  }

  /**
   * 
   * @param offset 
   * @param normalize 
   * @returns 
   */
  findNearestDrawDateWithToday = async (offset = 0, normalize = true): Promise<number | boolean> => {
    let from = moment().unix() + offset * 3600;   //for Lagos +3600=1hour=GMT+1

    let drawDays = this.drawDays ? JSON.parse(this.drawDays) : [];

    let normalizeDrawDateWithNigeria = await this.normalizeDrawDate(from, false);
    let normalizeDrawDateWithPlayedLocation = await this.normalizeDrawDate(from, true);

    if (normalizeDrawDateWithNigeria && from < normalizeDrawDateWithNigeria
    && drawDays.includes(moment(normalizeDrawDateWithPlayedLocation).format('E'))) {
      return normalize ? this.normalizeDrawDate(from) : from;
    }

    if (drawDays.length > 0) {
      let day = from;
      let _inarray = false;
      do {
        day += (3600 * 24);

        let _normalDrawDate = await this.normalizeDrawDate(day, true);
        _inarray = drawDays.includes(moment(_normalDrawDate).format('E'));
      } while (!_inarray);

      return normalize ? this.normalizeDrawDate(day) : day;
    }
    return false;
  }

  async isToday(): Promise<number> {
    let drawDays = this.drawDays ? JSON.parse(this.drawDays) : [];
    let day = await Lottery.normalize(moment().unix(), this.id, true);
    if (typeof day === 'number')
      return drawDays.includes(moment(day).format('E')) ? 1 : 0;
    return 0;
  }

  /**
   * 
   * @param date 
   * @param inverted 
   * @returns 
   */
  normalizeDrawDate = async (date: number, inverted = false): Promise<number> => {
    let ret = await Lottery.normalize(date, this.id, inverted);
    return (ret === false || ret === true) ? 0 : ret;
  }

  /**
   * 
   * @param date 
   * @param idLottery 
   * @param inverted 
   * @returns 
   */
  static normalize = async (date: number, idLottery: number, inverted = false): Promise<number | boolean> => {
    let lottery = await Lottery.findOne({
      where: {
        id: idLottery
      }
    });

    if (!lottery) return false;

    let cot = lottery.cutOffTime;
    if (lottery.name === 'megasena') {
      // pending
      let day = '';
      // let day = LtechPayload::findNearestDay([3, 6]); 
      
      if (day === 'saturday') {
        cot = lottery.cutOffTimeSat;
      }
    } else if (lottery.name === 'lotto-6aus49') {
      // pending
      let day = '';
      // let day = LtechPayload::findNearestDay([3, 6]);
      
      if (day === 'saturday') {
        cot = lottery.cutOffTimeSat;
      }
    }

    let _date = moment.unix(date).format('YYYY/MM/DD');

    if (inverted) {            //time in lottery location cut-off time
      _date = `${_date}${cot}`;
    } else {                    //time in Nigeria
      let plus =  cot.indexOf('+');
      let minus =  cot.indexOf('-');
      let pos = plus ? plus : minus;
      _date = _date + cot.substr(0, pos) + '+00:00';
    }

    return moment(_date).unix();   //this time is based on GMT 0
  }

  static convPlayedDateToNigDateTime = async (date: number, idLottery: number): Promise<number | boolean> => {
    let lottery = await Lottery.findOne({
      where: {
        id: idLottery
      }
    });

    if (!lottery) return false;
    
    let cot = lottery.cutOffTime;
    if (lottery.name === 'megasena') {
      // pending
      let day = '';
      // let day = LtechPayload::findNearestDay([3, 6]);
      if (day === 'saturday') {
        cot = lottery.cutOffTimeSat;
      }
    } else if (lottery.name === 'lotto-6aus49') {
      // pending
      let day = '';
      // let day = LtechPayload::findNearestDay([3, 6]);
      if (day == 'saturday') {
        cot = lottery.cutOffTimeSat;
      }
    }

    let _date = moment.unix(date).format('YYYY/MM/DD');
    let _cot = moment.unix(moment(cot).unix() - 3600).format('H:i:s');

    let plus =  cot.indexOf('+');
    let minus =  cot.indexOf('-');
    let pos = plus ? plus : minus;
    let offset = cot.substr(pos, cot.length);
    if (cot.indexOf('+')) {
      offset = offset.replace('+', '-');
    } else {
      offset = offset.replace('-', '+');
    }

    return moment(`${_date} ${_cot}${offset}`).unix();
  }

  /**
   * 
   * @param idLottery 
   * @returns 
   */
  static convCurrentNigeriaTimeToLotteryLocationTime = async (idLottery: number): Promise<number> => {
    let offset = 1;    //for Nigeria from GMT+0
    let currentNigeriaTime = moment().unix() + offset * 3600;

    try {
      let lottery = await Lottery.findOne({
        where: {
          id: idLottery
        }
      });

      if (!lottery) return currentNigeriaTime;
      
      let cot = lottery.cutOffTime;
      let plus =  cot.indexOf('+');
      let minus =  cot.indexOf('-');
      let pos = plus ? plus : minus;
      let offsetFromPlayed = parseInt(cot.substr(pos, pos + 2), 10);
      offsetFromPlayed = plus ?  plus : offsetFromPlayed * -1;

      return currentNigeriaTime + offsetFromPlayed * 3600;
    } catch (error) {
      console.log(error)
    }
    return currentNigeriaTime;
  }

  static drawCalendarFuture = async (tickets: Ticket[]) => {
    let dates = [];
    for (let i = 0; i < tickets.length; i++) {
      let userTicket = tickets[i];

      let lottery = await Lottery.findOne({
        where: {
          id: userTicket.idGame!
        }
      });

      if (!lottery) {
        return dates;
      }
        
      let offset = 1;
      let ret = await lottery.isToday();
      let ticketDays = lottery.planForLottery(userTicket.count! + 1 - ret, null, true, offset);
      
      for (let j = 0; j < ticketDays.length; j++) {
        let date = ticketDays[j];
       
        dates.push({
          idGame: userTicket.idGame,
          idTickets: [userTicket.id],
          date: date
        });
      }
    }
    return dates;
  }

  static drawCalendarPast = async (tickets: Ticket[]) => {
    let dates = [];
    for (let i = 0; i < tickets.length; i++) {
      let userTicket = tickets[i];
      for (let j = 0; userTicket.draws.length; j++) {
        let draw = userTicket.draws[j];
        let r = await Lottery.normalize(draw.drawDay as number, userTicket.lottery!.id);
        if (typeof r === 'number') {
          let date = moment.unix(r).format();

          dates.push({
            idGame: userTicket.idGame,
            idTickets: [userTicket.id],
            date: date
          });
        }
      }
    }
    return dates;
  }

  static userCalendar = async () => {
      // todo check if works correctly
      // pending
      let tickets: Ticket[] = [];
      // let tickets: Ticket[] = Ticket.userTickets();
      let futureCalendar = await Lottery.drawCalendarFuture(tickets);
      let pastCalendar = await Lottery.drawCalendarPast(tickets);

      let merged = [...pastCalendar, ...futureCalendar];

      // tickets to array
      // pending
      // DrawDates::compact(merged);
      return merged;
  }


  getNextDrawTimeUp = async (): Promise<string> => {
    const lottery = await Lottery.findOne({
      where: {
        id: this.id
      }
    });

    let offset = 1;
    let time = lottery?.findNearestDrawDateWithToday(offset);
    if (typeof time === 'number')
      return moment.unix(time ? time + 3600 : 3600).format();
    return moment().format();
  }

  static biggestJackpotLottery = async () => {
    let ret = await Lottery.findAll({
      order: [
        ['jackpot', 'desc']
      ]
    });

    return ret;
  }
  
  /**
   * 
   * @param idLottery 
   * @param lottery 
   */
  static updatePastLotteries = async (idLottery: number, draws: any[]) => {
    for (let i = 0; i < draws.length; i++) {
      let one = draws[i];
        
      if (one.numbers && one.prizes && one.winners) {
        let past = await Pastdraw.findOne({
          where: {
            idLottery: idLottery,
            date: moment(one.date).unix()
          }
        });
        if (!past) {
          let past = await Pastdraw.create({
            date: moment(one.date).unix(),
            idLottery: idLottery,
            mainNumbers: JSON.stringify(one.numbers.main),
            number: one.number,
            // pending
            // bonusNumbers: LtechPayload::getBonusNumbers(one),
            // additionalNumbers: LtechPayload::getOtherNumbers(one),
          });
          
          // pending
          // LtechPayload::alterResults(one, past.id);
        }
      }
    }
  }

  static favoriteLottery = async (idUser: number): Promise<number | boolean> => {
    let ret: any = await db.sequelize.query(
      'select idGame, max(duration) as dur from ticket where idUser=:idUser group by idGame order by idUser desc',
      {
        type: QueryTypes.SELECT,
        replacements: {
          idUser: idUser
        }
      }
    )
    return ret ? ret.idGame : false;
  }

  static notPlayedLotteryUsers = async (idLottery: number, dateFrom: number, dateTo: number): Promise<User[]> => {
    if (!dateTo) {
      dateTo = moment().unix();
    }

    let users = await Lottery.playedLotteryUsers(idLottery, dateFrom, dateTo);
    
    let ids: number[] = [];
    users.forEach(user => {
      if (!ids.includes(user.id)) {
        ids.push(user.id);
      }
    });

    let ret = await User.findAll({
      where:  {
        status: USER_STATUS.STATUS_ACTIVE,
        id: {
          [Op.notIn]: ids
        }
      }
    });
    
    return ret;
  }

  static playedLotteryUsers = async (idLottery: number, dateFrom: number, dateTo: number): Promise<User[]> => {
    if (!dateTo) {
      dateTo = moment().unix();
    }
    
    let ret = await User.findAll({
      include: [
        {
          model: Ticket,
          required: true,
          include: [
            {
              model: Draw,
            }
          ]
        }
      ],
      where: {
        ['$tickets.idGame$']: idLottery,
        ['$tickets.draws.drawDay$']: {
          [Op.and]: {
            [Op.gt]: dateFrom,
            [Op.lte]: dateTo
          }
        },
        status: USER_STATUS.STATUS_ACTIVE
      },
    });

    return ret;
  }

  static formatBigNumber(value: number, decimals = 1): string {
    let div = 1; 
    let str = '';
    if (value >= 1000000000) {
      div = 1000000000;
      str = 'B';
    } else if (value >= 1000000) {
      div = 1000000;
      str = 'M';
    } else if (value >= 1000) {
      div = 1000;
      str = 'K';
    }

    const mult = Math.pow(10, decimals);
    const out = Math.round(value / (div / mult)) / mult;

    const valueStr: string = out.toFixed(0);
    const parts = valueStr.split('.');

    if (parts.length > 0)
      parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  }

  static allJackpotSum = async (): Promise<number> => {
    let sum = 0;
    let ret = await Lottery.findAll({
      where: {
        enabled: SingleStatus.ENABLED
      }
    });

    ret.forEach(v => sum += v.jackpotCorrected);
    
    return sum;
  }

  static getTopJackpots = async (count: number = 3): Promise<Lottery[]> => {
    const ret = await Lottery.findAll({
      where: {
        enabled: SingleStatus.ENABLED
      },
      order: [
        ['jackpot', 'desc']
      ],
      limit: count,
    });
    return ret;
  }

  static randomNumberList(min: number, max: number, count: number): number[] {
    let numbers: number[] = [];
    let num;
    for (let i = 0; i < count; ++i) {
      do {
        num = Math.random() * (max - min) + min;
      } while (numbers.includes(num));

      numbers.push(num);
    }
    return numbers;
  }

  getJackpotCorrected = async (): Promise<number> => {
    return await Currency.convert(this.jackpot, this.currency);
  }
}

Lottery.init(
  {
    ...SequelizeAttributes.Lottery,
    regNumCount: {
      type: DataTypes.VIRTUAL,
      get(): number {
        const rawValue = this.numberCount;
        return rawValue;
      }
    },
    nextDrawTimeUp: {
      type: DataTypes.VIRTUAL,
      get(): number {
        const rawValue = this.nextDrawTime;
        return rawValue;
      }
    },
    endBuingTimeUp: {
      type: DataTypes.VIRTUAL,
      get(): number {
        const rawValue = this.endBuingTime;
        return rawValue; 
      },
    },      
    backgroundImgUrl: {
      type: DataTypes.STRING(255),
      get(): string {
        return getLotteryImgPath(this.name, 'background');
      }
    },
    logoImgUrl: {
      type: DataTypes.VIRTUAL,
      get(): string {
        return getLotteryImgPath(this.name, 'logo');
      }
    },
    ballImgUrl: {
      type: DataTypes.VIRTUAL,
      get(): string {
        return getLotteryImgPath(this.name, 'ball');
      }
    },
    
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'lottery',
  }
);

Lottery.hasMany(LotteryPrice, {
  foreignKey: 'idLottery',
  sourceKey: 'id',
  as: 'lotteryPrices',
});

LotteryPrice.belongsTo(Lottery, {
  foreignKey: 'idLottery',
  targetKey: 'id',
  as: 'lottery',
  constraints: false,
});

Lottery.hasMany(Ticket, {
  foreignKey: 'idGame',
  sourceKey: 'id',
  as: 'tickets',
});

Ticket.belongsTo(Lottery, {
  targetKey: 'id',
  foreignKey: 'idGame',
  as: 'lottery',
  constraints: false,
});

Lottery.hasMany(Pastdraw, {
  sourceKey: 'id',
  foreignKey: 'idLottery',  
  as: 'pastdraws',
});

Pastdraw.belongsTo(Lottery, {
  targetKey: 'id',
  foreignKey: 'idLottery',
  as: 'lottery',
  constraints: false,
});

Lottery.hasMany(Vipcombo, {
  sourceKey: 'id',
  foreignKey: 'idLottery',  
  as: 'vipcombos',
});

Vipcombo.belongsTo(Lottery, {
  foreignKey: 'idLottery',
  targetKey: 'id',
  as: 'lottery',
  constraints: false,
});

export default Lottery;