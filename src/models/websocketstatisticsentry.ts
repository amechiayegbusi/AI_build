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

class WebsocketsStatisticsEntry extends Model<InferAttributes<WebsocketsStatisticsEntry>, InferCreationAttributes<WebsocketsStatisticsEntry>> {
  declare id: CreationOptional<number>;

  declare appId: string;

  declare peakConnectionCount: number;

  declare websocketMessageCount: number;

  declare apiMessageCount: number;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;
}

WebsocketsStatisticsEntry.init(
  {
    ...SequelizeAttributes.WebsocketsStatisticsEntries,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'websockets_statistics_entries',
  }
);

export default WebsocketsStatisticsEntry;
