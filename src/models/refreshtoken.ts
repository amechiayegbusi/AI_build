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

class RefreshToken extends Model<
  InferAttributes<RefreshToken>,
  InferCreationAttributes<RefreshToken>
> {
  declare id: CreationOptional<number>;

  declare userId: number | null;

  declare token: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

RefreshToken.init(
  {
    ...SequelizeAttributes.RefreshTokens,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'refresh_tokens',
  }
);

export default RefreshToken;
