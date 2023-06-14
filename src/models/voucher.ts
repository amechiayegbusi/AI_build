import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
} from 'sequelize';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import { VOUCHER_DATE_STATUS, VOUCHER_LOTTERY_TYPE, VOUCHER_REDEEM_STATUS, VOUCHER_WHERE_TYPE, VOUCHER_USER } from 'constants/ConstVoucher';
import db from './_instance';
import Voucheruser from './voucheruser';
import Voucherlottery from './voucherlottery';

class Voucher extends Model<
  InferAttributes<Voucher, { omit: 'voucherusers' | 'startDateUp' | 'endDateUp' | 'dateStatus' }>,
  InferCreationAttributes<Voucher, { omit: 'voucherusers' | 'startDateUp' | 'endDateUp' | 'dateStatus' }>
> {
  declare id: CreationOptional<number>;

  declare code: string | null;

  declare amount: number | null;

  declare whereType: number | null;

  declare moneyType: number | null;

  declare bonusType: number | null;

  declare count: number | null;

  declare usageCount: number | null;

  declare hasLottery: number | null;

  declare cashThreshold: number | null;

  declare startDate: Date | null;

  declare endDate: Date | null;

  declare title: string | null;

  declare description: string | null;

  declare enabled: number | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare voucherusers?: NonAttribute<Voucheruser[]> | null;

  declare static associations: {
    voucherusers: Association<Voucher, Voucheruser>;
  };

  get startDateUp(): NonAttribute<Date | null> {
    if (!this.startDate)
      return null;

    const newDate = new Date(this.startDate);
    newDate.setHours(newDate.getHours() + 1);

    return newDate;
  }

  get endDateUp(): NonAttribute<Date | null> {
    if (!this.endDate)
      return null;

    const newDate = new Date(this.endDate);
    newDate.setHours(newDate.getHours() + 1);

    return newDate;
  }

  get dateStatus(): NonAttribute<number> {
    if (!this.startDate && !this.endDate)
      return VOUCHER_DATE_STATUS.DATE_STATUS_ACTIVE;

    const now = new Date();
    if (this.startDate && this.startDate > now)
      return VOUCHER_DATE_STATUS.DATE_STATUS_PENDING;
    else if (this.endDate && this.endDate < now)
      return VOUCHER_DATE_STATUS.DATE_STATUS_EXPIRED;
    
    return VOUCHER_DATE_STATUS.DATE_STATUS_ACTIVE;
  }

  getRemainCount = async (): Promise<number> => {
    if (this.count !== 0) {
      const voucherUsersCnt: number = await Voucheruser.count({ where: { idVoucher: this.id } });
      return this.count = voucherUsersCnt;
    }

    return 1;
  }

  getLotteries = async (): Promise<Voucherlottery[] | null> => {
    if (this.hasLottery === 2) {    // specific lotteries
      return await Voucherlottery.findAll({ where: { idVoucher: this.id } });
    }

    return null;
  }

  getIsAvailable = async(): Promise<boolean> => {
    if (this.enabled === 0)
      return false;

    const remainCnt = await this.getRemainCount();
    if (remainCnt <= 0)
      return false;

    if (this.dateStatus !== VOUCHER_DATE_STATUS.DATE_STATUS_ACTIVE)
      return false;

    return true;
  }

  getIsAvailableByUser = async(idUser: number): Promise<boolean> => {
    if (!idUser)
      return false;

    if (!this.getIsAvailable())
      return false;
    
    const voucherUser = await Voucheruser.findOne({ where: { idUser: idUser, idVoucher: this.id } });
    if (!voucherUser)
      return false;

    if (!voucherUser.isAvailable)
      return false;

    return true;
  }

  getIsAvailableByLottery = async (idLottery: number): Promise<boolean> => {
    if (!idLottery)
      return false;

    if (this.whereType === VOUCHER_WHERE_TYPE.WHERE_TYPE_TICKET && this.hasLottery === VOUCHER_LOTTERY_TYPE.LOTTERY_SPECIFIC) {
      const voucherLottery = await Voucherlottery.findOne({ where: { idVoucher: this.id, idLottery: idLottery } });
      if (voucherLottery === null || !voucherLottery)
        return false;
    }

    return true;
  }

  static hasUserVoucher = async (idUser: number, whereType: number = 0, idLottery: number = 0): Promise<boolean | Voucheruser> => {
    if (!idUser)
      return false;

    let voucherUser = await Voucheruser.findOne({ where: { idUser: idUser, status: VOUCHER_USER.STATUS_REDEEM } })
    if (voucherUser === null || !voucherUser)
      return false;

    if (whereType) {
      if (voucherUser.voucher && voucherUser.voucher.whereType !== whereType)
        return false;
    }

    let voucher = null;
    if (voucherUser.idVoucher) {
      voucher = await Voucher.findOne({ where: { id: voucherUser.idVoucher } });
      if (voucher === null || !voucher) {
        voucherUser.status = VOUCHER_USER.STATUS_USED;
        await voucherUser.save();
        return false;
      }
    }

    // available count
    if (voucher) {
      const remainCnt = await voucher.getRemainCount();
      if (remainCnt <= 0) {
        voucherUser.status = VOUCHER_USER.STATUS_USED;
        await voucherUser.save();
        return false;
      }
    }

    // available usageCount
    if (voucherUser.remainUsageCount <= 0) {
      voucherUser.status = VOUCHER_USER.STATUS_USED;
      await voucherUser.save();
      return false;
    }

    // available date?
    if (voucher) {
      if (voucher.dateStatus !== VOUCHER_DATE_STATUS.DATE_STATUS_ACTIVE) {
        voucherUser.status = VOUCHER_USER.STATUS_EXPIRED;
        await voucherUser.save();
        return false;
      }
    }

    if (voucher && whereType && idLottery) {
      if (whereType === VOUCHER_WHERE_TYPE.WHERE_TYPE_TICKET && voucher.hasLottery === VOUCHER_LOTTERY_TYPE.LOTTERY_SPECIFIC) {
        const voucherLottery = await Voucherlottery.findOne({ where: { idVoucher: voucher.id, idLottery: idLottery } });
        if (voucherLottery === null || !voucherLottery)
          return false;
      }
    }
    
    return voucherUser;
  }
}

Voucher.init(
  {
    ...SequelizeAttributes.Voucher,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Voucher',
  }
);

Voucher.hasMany(Voucheruser, {
  sourceKey: 'id',
  foreignKey: 'idVoucher',
  as: 'voucherusers',
});

Voucheruser.belongsTo(Voucher, {
  targetKey: 'id',
  foreignKey: 'idVoucher',
  as: 'voucher',
  constraints: false,
});

export default Voucher;
