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
import Vipcombo from './vipcombo';
import Currency from './currency';
import LotteryPrice from './lotteryprice';

class Vip extends Model<
  InferAttributes<Vip, { omit: 'vipcombos' }>,
  InferCreationAttributes<Vip, { omit: 'vipcombos' }>
> {
  declare id: CreationOptional<number>;

  declare name: string | null;

  declare type: number | null;

  declare comboCount: number | null;

  declare ticketCount: number | null;

  declare drawsCount: number | null;

  declare discount: number | null;

  declare logoImgUrl: string | null;

  declare status: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare jackpot: NonAttribute<number | null>;

  declare vipcombos?: NonAttribute<Vipcombo[]>;

  declare static associations: {
    vipcombos: Association<Vip, Vipcombo>;
  };

  getAllPrice = async (): Promise<number | null> => {
    if (!this.vipcombos)
      return 0;

    if (!this.discount)
      return 0;

    let priceAll = 0;
    for (let i = 0; i < this.vipcombos.length; i++) {
      const eachCombo = this.vipcombos[i];
      
      if (!eachCombo.ticketCount)
        continue;

      if (!eachCombo.lottery)
        continue;

      const lotteryPrices = await LotteryPrice.findAll({
        where: {
          idLottery: eachCombo.lottery.id as number
        }
      });

      if (!lotteryPrices || lotteryPrices.length === 0)
        continue;

      if (!lotteryPrices[0].pricePerLine)
        continue;

      priceAll += lotteryPrices[0].pricePerLine * eachCombo.ticketCount;
    }

    return priceAll * ((100 - this.discount) / 100.0);
  }

  getAllJackpot = async (): Promise<number | null> => {
    if (!this.vipcombos)
      return 0;

    let jackpotAll = 0;
    for (let i = 0; i < this.vipcombos.length; i++) {
      const eachCombo = this.vipcombos[i];
      
      if (!eachCombo.lottery)
        continue;

      const convertedJackpot = await Currency.convert(eachCombo.lottery.jackpot, eachCombo.lottery.currency);
      if (isNaN(parseInt(convertedJackpot.toString(), 10)))
        continue;

      jackpotAll += convertedJackpot;
    }

    return jackpotAll;
  }
}

Vip.init(
  {
    ...SequelizeAttributes.Vip,    
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'vipcombos'],
      },
    },
    tableName: 'Vip',    
  }
);

Vip.hasMany(Vipcombo, {
  sourceKey: 'id',
  foreignKey: 'idVip',
  as: 'vipcombos',
});

Vipcombo.belongsTo(Vip, {
  targetKey: 'id',
  foreignKey: 'idVip',
  as: 'vip',
  constraints: false,
});

export default Vip;
