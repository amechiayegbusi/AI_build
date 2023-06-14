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

class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare id: CreationOptional<number>;

  declare userId: number | null;

  declare token: string | null;

  declare ipAddress: string | null;

  declare device: string | null;

  declare platform: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

Session.init(
  {
    ...SequelizeAttributes.Sessions,
  },
  {
    sequelize: db.sequelize as any,    
    paranoid: true,
    tableName: 'sessions',
  }
);

export default Session;
