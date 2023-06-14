import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
} from 'sequelize';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import { getLotteryImgPath } from 'utils/Asset';
import db from './_instance';
import Lottery from './lottery';
import Lotteryprice from './lotteryprice';
import Vip from './vip';

class Vipcombo extends Model<
  InferAttributes<Vipcombo, { omit: 'lotteryTitle' | 'slug' | 'ballImgUrl' | 'numberMax' | 'numberCount' | 'bonusMin' | 'bonusMax' | 'bonusNumCount' }>,
  InferCreationAttributes<Vipcombo, { omit: 'lotteryTitle' | 'slug' | 'ballImgUrl' | 'numberMax' | 'numberCount' | 'bonusMin' | 'bonusMax' | 'bonusNumCount' }>
> {
  declare id: CreationOptional<number>;

  declare idVip: number | null;

  declare idLottery: number | null;

  declare ticketCount: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare lottery?: NonAttribute<Lottery | null>;

  declare vip?: NonAttribute<Vip | null>;

  declare static associations: {
    lottery: Association<Vipcombo, Lottery>;
    vip: Association<Vipcombo, Vip>;
  };

  get lotteryTitle(): NonAttribute<string | null> {
    if (!this.lottery)
      return '';

    return this.lottery.caption;
  }

  get slug(): NonAttribute<string | null> {
    if (!this.lottery)
      return '';

    return this.lottery.name;
  }

  get ballImgUrl(): NonAttribute<string | null> {
    if (!this.lottery)
      return '';

    return getLotteryImgPath(this.lottery.name, 'ball');
  }

  get numberMax(): NonAttribute<number | null> {
    if (!this.lottery)
      return 0;

    return this.lottery.numberMax;
  }

  get numberCount(): NonAttribute<number | null> {
    if (!this.lottery)
      return 0;

    return this.lottery.numberCount;    
  }

  get bonusMin(): NonAttribute<number | null> {
    if (!this.lottery)
      return 0;

    return this.lottery.bonusMin;
  }

  get bonusMax(): NonAttribute<number | null> {
    if (!this.lottery)
      return 0;

    return this.lottery.bonusMax;
  }

  get bonusNumCount(): NonAttribute<number | null> {
    if (!this.lottery)
      return 0;

    return this.lottery.bonusNumCount;
  }

  price = async (): Promise<number | null> => {
    if (!this.idLottery)
      return 0;

    const lotteryPrice = await Lotteryprice.findOne({ where: { idLottery: this.idLottery } });
    if (lotteryPrice === null || !lotteryPrice)
      return 0;

    if (!lotteryPrice.pricePerLine)
      return 0;

    if (!this.ticketCount)
      return 0;

    if (!this.vip)
      return 0;

    if (!this.vip.discount)
      return 0;

    return lotteryPrice.pricePerLine * this.ticketCount * ((100 - this.vip.discount) / 100.0);
  }
}

Vipcombo.init(
  {
    ...SequelizeAttributes.Vipcombo,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Vipcombo',
  }
);

export default Vipcombo;
