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
import Lottery from './lottery';
import Pastdrawmatch from './pastdrawmatch';

class Pastdraw extends Model<
  InferAttributes<Pastdraw, { omit: 'lottery' }>,
  InferCreationAttributes<Pastdraw, { omit: 'lottery' }>
> {
  declare id: CreationOptional<number>;

  declare idLottery: number | null;

  declare date: number | null;

  declare mainNumbers: string | null;

  declare bonusNumbers: string | null;

  declare additionalNumbers: string | null;

  declare number: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare lottery?: NonAttribute<Lottery>;

  declare pastdrawmatches?: NonAttribute<Pastdrawmatch[]>;

  declare static associations: {
    pastdrawmatches: Association<Pastdraw, Pastdrawmatch>;
  };
  
  async nigDate(date: number | null, idLottery: number | null): Promise<NonAttribute<number | boolean>> {
    if (!date || !idLottery)
      return false;

    return false;
    // const nigDateTime = await Lottery.convPlayedDateToNigDateTime(date, idLottery);
    // return nigDateTime;
  }

  async getMatches(): Promise<any[]> {
    const replaceMatch = 'match-';
    let removeMatch = '';
    if (this.lottery === null || !this.lottery)
      return [];

    if (this.lottery.name === 'powerball')
      removeMatch = '-pp';
    else if (this.lottery.name === 'megamillions')
      removeMatch = '-mp';

    removeMatch = '-mp';

    const pastdraw = await Pastdraw.findByPk(this.id);
    if (pastdraw === null)
      return [];

    const pastdrawmatches = pastdraw.pastdrawmatches;
    if (pastdrawmatches === null || !pastdrawmatches || pastdrawmatches.length === 0)
      return [];

    // pending ...
    const result = pastdrawmatches.map((item, index) => {
      let match = item.match;
      if (!match)
        return item;

      if (removeMatch && removeMatch.length > 0 && match.includes(removeMatch))
        return item;

      match = match.replace(replaceMatch, '');
      if (removeMatch && removeMatch.length > 0) {
        if (match.length === 1) {
          match = match.concat('+0');
        } else {
          if (this.lottery) {
            if (this.lottery.name === 'powerball')
              match = match.replace('-p', '+1');
            else if (this.lottery.name === 'megamillions')
              match = match.replace('-m', '+1');
          }          
        }
      }

      item.match = match;

      return item;
    });
    
    return result;
  }
}

Pastdraw.init(
  {
    ...SequelizeAttributes.Pastdraw,
  },
  {
    sequelize: db.sequelize as any,    
    paranoid: true,
    tableName: 'pastdraw',
  }
);

Pastdraw.hasMany(Pastdrawmatch, {
  sourceKey: 'id',
  foreignKey: 'idPastDraw',
  as: 'pastdrawmatches',
});

export default Pastdraw;
