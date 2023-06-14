import SequelizeAttributes from 'utils/SequelizeAttributes'
import db from './_instance';

import {
  Model,
  ModelDefined, Optional,
} from 'sequelize';

type AdminSettingAttributes = {
  id: number;
  key: string;
  value: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

interface AdminSettingCreationAttributes extends Optional<AdminSettingAttributes, 'id'> {}

export interface AdminSettingInstance extends Model<AdminSettingAttributes, AdminSettingCreationAttributes> {};

const AdminSetting: ModelDefined<AdminSettingAttributes, AdminSettingCreationAttributes> = 
  db.sequelize.define<AdminSettingInstance>(
    'AdminSetting',
    {
      ...SequelizeAttributes.AdminSetting,
    },
    {
      paranoid: true,
      tableName: 'settings',
    }
  );

export default AdminSetting;