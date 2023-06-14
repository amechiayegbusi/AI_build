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

class PersonalAccessToken extends Model<InferAttributes<PersonalAccessToken>, InferCreationAttributes<PersonalAccessToken>> {
  declare id: CreationOptional<number>;

  declare tokenableType: string;

  declare tokenableId: number;

  declare name: string;

  declare token: string;

  declare abilities: string | null;

  declare lastUsedAt: Date | null;

  declare expiresAt: Date | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

PersonalAccessToken.init(
  {
    ...SequelizeAttributes.PersonalAccessTokens,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'personal_access_tokens',
  }
);

export default PersonalAccessToken;
