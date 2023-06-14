import { Request } from 'express';
import Vip from 'models/vip';
import Vipcombo from 'models/vipcombo';
import Lottery from 'models/lottery';
import { VipAttributes } from 'types/lottery';

class VipService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request): Promise<VipAttributes[]> {
    let vipList = await Vip.findAll({
      /* attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      }, */
      include: [
        {
          model: Vipcombo,
          as: 'vipcombos',
          /* attributes: {
            exclude: ['idVip', 'idLottery', 'ticketCount', 'createdAt', 'updatedAt', 'deletedAt']
          }, */
          include: [
            {
              model: Lottery,
              as: 'lottery',
            }
          ]
        }
      ]
    });

    let newVipList: VipAttributes[] = [];

    for (let i = 0; i < vipList.length; i++) {
      let eachVip = vipList[i];
      if (!eachVip)
        continue;

      const jackpot = await eachVip.getAllJackpot();
      const price = await eachVip.getAllPrice();
      
      newVipList.push({
        id: eachVip.id as number,
        name: eachVip.name as string,
        type: eachVip.type as number,
        comboCount: eachVip.comboCount as number,
        ticketCount: eachVip.ticketCount as number,
        drawsCount: eachVip.drawsCount as number,
        discount: eachVip.discount as number,
        logoImgUrl: eachVip.logoImgUrl as string,
        status: eachVip.status as number,
        jackpot: Math.floor(jackpot as number),
        price: Math.floor(price as number),
      });
    }

    return newVipList;
  }

  /**
   *
   * @param req Request
   */
  public static async getDetails(vipId: number): Promise<VipAttributes | null> {
    const vipInfo = await Vip.findByPk(vipId, {
      /* attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      }, */
      include: [
        {
          model: Vipcombo,
          as: 'vipcombos',
          /* attributes: {
            exclude: ['idVip', 'idLottery', 'ticketCount', 'createdAt', 'updatedAt', 'deletedAt']
          }, */
          include: [
            {
              model: Lottery,
              as: 'lottery',
            }
          ]
        }
      ]
    });

    if (!vipInfo)
      return null;

    let newVipInfo: VipAttributes = {
      id: vipInfo.id as number,
      name: vipInfo.name as string,
      type: vipInfo.type as number,
      comboCount: vipInfo.comboCount as number,
      ticketCount: vipInfo.ticketCount as number,
      drawsCount: vipInfo.drawsCount as number,
      discount: vipInfo.discount as number,
      logoImgUrl: vipInfo.logoImgUrl as string,
      status: vipInfo.status as number,
    };

    const jackpot = await vipInfo.getAllJackpot();
    const price = await vipInfo.getAllPrice();

    newVipInfo.jackpot = Math.floor(jackpot as number);
    newVipInfo.price = Math.floor(price as number);
    
    return newVipInfo;
  }
}

export default VipService;
