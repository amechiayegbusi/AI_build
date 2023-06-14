import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

class Language extends Model<InferAttributes<Language>, InferCreationAttributes<Language>> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare label: string;
  declare locale: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

Language.init(
  {
    ...SequelizeAttributes.Language,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'language',
  }
);

export default Language;