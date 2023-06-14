import { Op } from 'sequelize';
import { VOUCHER_REDEEM_STATUS } from 'constants/ConstVoucher';
import { VoucherAttributes, ApplyVoucherReqAttributes, ApplyVoucherResAttributes } from 'types/lottery';
import Voucher from 'models/voucher';
import Voucheruser from 'models/voucheruser';

class VoucherService {
  /**
   *
   * @param req Request
   */
  public static async getAll(loggedInUserId: number): Promise<VoucherAttributes[]> {
    let voucherList = await Voucher.findAll({
      where: {
        [Op.or]: [
          {
            endDate: {
              [Op.gte]: new Date()
            }
          },
          {
            endDate: {
              [Op.is]: null
            }
          }
        ]
      },
      order: [
        ['id', 'DESC']
      ]
    });

    let newVoucherList: VoucherAttributes[] = [];

    for (let i = 0; i < voucherList.length; i++) {
      let eachVoucher = voucherList[i];
      if (!eachVoucher)
        continue;

      const isAvailable = await eachVoucher.getIsAvailableByUser(loggedInUserId);
      if (!isAvailable)
        continue;
      
      newVoucherList.push({
        id: eachVoucher.id as number,
        code: eachVoucher.code as string,
        amount: eachVoucher.amount as number,
        whereType: eachVoucher.whereType as number,
        moneyType: eachVoucher.moneyType as number,
        bonusType: eachVoucher.bonusType as number,
        count: eachVoucher.count as number,
        usageCount: eachVoucher.usageCount as number,
        hasLottery: eachVoucher.hasLottery as number,
        cashThreshold: eachVoucher.cashThreshold as number,
        startDate: eachVoucher.startDate as Date,
        endDate: eachVoucher.endDate as Date,
        title: eachVoucher.title as string,
        description: eachVoucher.description as string,
        enabled: eachVoucher.enabled as number,
        redeemStatus: VOUCHER_REDEEM_STATUS.REDEEM_STATUS_FREE,
      });
    }

    return newVoucherList;
  }

  /**
   *
   * @param req Request
   */
  public static async applyVoucher(loggedInUserId: number, formData: ApplyVoucherReqAttributes): Promise<ApplyVoucherResAttributes | null> {
    const voucher = await Voucher.findOne({
      where: {
        code: formData.code
      }
    });
    if (!voucher) {
      return {
        status: 'fail',
        message: 'Voucher does not exist'
      };
    }

    if (voucher.whereType != formData.whereType) {
      return {
        status: 'fail',
        message: 'This is unsupported voucher'
      };
    }

    const isAvailable = await voucher.getIsAvailableByUser(loggedInUserId);
    if (!isAvailable) {
      return {
        status: 'fail',
        message: 'Voucher is not available'
      };
    }

    let voucherUser = await Voucheruser.findOne({
      where: {
        idUser: loggedInUserId,
        idVoucher: voucher.id
      }
    });

    if (!voucherUser) {
      voucherUser = await Voucheruser.create({
        idVoucher: voucher.id,
        idUser: loggedInUserId,
        status: 0,
        usageCount: 0
      });
    }

    return {
      status: 'success',
      message: 'success',
      idVoucherUser: voucherUser.id,
      voucher: {
        id: voucher.id,
        code: voucher.code as string,
        amount: voucher.amount as number,
        whereType: voucher.whereType as number,
        moneyType: voucher.moneyType as number,
        bonusType: voucher.bonusType as number,
        count: voucher.count as number,
        usageCount: voucher.usageCount as number,
        hasLottery: voucher.hasLottery as number,
        cashThreshold: voucher.cashThreshold as number,
        startDate: voucher.startDate as Date,
        endDate: voucher.endDate as Date,
        title: voucher.title as string,
        description: voucher.description as string,
        enabled: voucher.enabled as number,        
      }
    }
  }
}

export default VoucherService;
