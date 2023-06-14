import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
  QueryTypes,
} from 'sequelize';
import bcrypt from 'bcrypt';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import { USER_STATUS } from 'constants/ConstUser';
import db from './_instance';
import Session from './session';
import Paymentmethod from './paymentmethod';
import Ticket from './ticket';
import Transaction from './transaction';
import UserToManagerMessage from './usertomanagermessage';

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User, { omit: 'password' }>
> {
  declare id: CreationOptional<number>;

  declare authKey: string;

  declare managerId: number | null;

  declare name: string | null;

  declare lname: string | null;

  declare gender: number;

  declare dob: number;

  declare passwordHash: string;

  declare passwordResetToken: string | null;
  
  declare email: string | null;

  declare phone: string | null;

  declare pin: string | null;

  declare country: string | null;

  declare status: number;

  declare title: string | null;

  declare role: number | null;

  declare dateBannedUntil: number | null;

  declare avatar: string | null;

  declare idEMerchant: number | null;

  declare countryCode: string | null;

  declare idTimezone: number | null;

  declare streetName: string | null;

  declare streetNumber: string | null;

  declare postCode: string | null;

  declare city: string | null;

  declare optionalAddress: string | null;

  declare notifications: number;

  declare depositLimit: number;

  declare cid: string | null;

  declare idReferral: string | null;

  declare idMaster: string | null;

  declare hadReferralDiscount: number | null;

  declare language: string;

  declare timezoneApproved: number | null;

  declare visitToken: string | null;

  declare migrate: number;

  declare trxId: number | null;

  declare idReferralUser: number | null;

  declare fromWhere: number | null;

  declare resetPassword: number | null;

  declare commissionReferral: number | null;

  declare commissionAgent: number | null;

  declare type: number | null;

  declare emailVerified: number | null;

  declare phoneVerified: number | null;

  declare tokenVerify: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare deletedAt: CreationOptional<Date>;

  declare password?: NonAttribute<string> | null;

  comparePassword = (candidatePassword: string): Promise<boolean> => {
    const tempPassword = this.getDataValue('passwordHash')
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, tempPassword!, function (err, isMatch) {
        if (err) reject(err)
        resolve(isMatch)
      })
    })
  }

  getIdFavoriteGame = async (): Promise<number | boolean> => {
    return 0;
  }

  static findByEmail = async (email: string): Promise<User | null> => {
    const user = await User.findOne({ where: { email: email } });
    return user;
  }

  static findByPhoneWithCode = async (phoneWithCode: string): Promise<User | null> => {
    if (!phoneWithCode.trim().startsWith('+'))
      phoneWithCode = '+'.concat(phoneWithCode);

    const users: any = await db.sequelize.query(
      'SELECT * FROM user WHERE status = $1 AND CONCAT(countryCode, "", phone) = $2',
      {
        bind: [USER_STATUS.STATUS_ACTIVE, phoneWithCode],
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true,
      }
    );

    if (!users || users.length <= 0)
      return null;

    return users[0];
  }
}

User.init(
  {
    ...SequelizeAttributes.User,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['password', 'passwordHash', 'tokenVerify', 'authKey'],
      },
    },
    scopes: {
      withPassword: {},
    },
    tableName: 'user',    
  }
);

User.hasMany(Paymentmethod, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'paymentmethods',
});

Paymentmethod.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
  constraints: false,
});

User.hasOne(Session, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  as: 'session',
});

Session.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'user_id',
  constraints: false,
});

User.hasMany(Ticket, {
  sourceKey: 'id',
  foreignKey: 'idUser',
  as: 'tickets',
});

Ticket.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'idUser',
  as: 'user',
  constraints: false,
});

User.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idUser',
  as: 'transactions',
});

Transaction.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'idUser',
  constraints: false,
});

User.hasMany(UserToManagerMessage, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  as: 'userToManagerMessages',
});

UserToManagerMessage.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
  as: 'user',
  constraints: false,
});

export default User;
