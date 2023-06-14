import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import Lottery from './lottery';

class LotteryPrice extends Model<InferAttributes<LotteryPrice>, InferCreationAttributes<LotteryPrice>> {
  declare id: CreationOptional<number>;
  declare idLottery: number;
  declare pricePerLine: number;
  declare priceMultiplier: number;
  declare quantity: number;
  declare idContentfulDuration: number;

  declare lottery: NonAttribute<Lottery>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  static getPriceByDuration = async (idLottery: number, duration: number) => {
    let lotteryPrice = await LotteryPrice.findOne({
      where: {
        idLottery: idLottery,
        quantity: duration
      }
    });

    if (lotteryPrice) {
      return lotteryPrice.pricePerLine;
    } else {
      return 0;
    }
  }
}

LotteryPrice.init(
  {
    ...SequelizeAttributes.LotteryPrice,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'lotteryprice',
  }
);

export default LotteryPrice;