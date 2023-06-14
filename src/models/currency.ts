import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

class Currency extends Model<InferAttributes<Currency>, InferCreationAttributes<Currency>> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare rate: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;

  /**
   * @param amount
   * @param from
   */
  static convert = async (amount: number, from: string): Promise<number> => {
    let currency = await Currency.findOne({
      where: {
        code: from
      }
    });
    let rate = currency?.getDataValue('rate');
    return amount / (rate ? rate : 1);
  } 

  /**
   * @param amount
   * @param to
   */
  static convertTo = async (amount: number, to: string): Promise<number> => {
    let currency = await Currency.findOne({
      where: {
        code: to
      }
    });
    
    let rate = currency?.getDataValue('rate');
    return amount / (rate ? rate : 1);
  }
}

Currency.create();
Currency.init({
  ...SequelizeAttributes.Currency
}, {
  sequelize: db.sequelize as any,
  tableName: 'currency',
});

export default Currency;