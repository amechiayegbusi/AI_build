import ms from 'ms';
import { Request } from 'express';
import db from 'models/_instance';
import ResponseError from 'modules/Response/ResponseError';
import useValidation from 'helpers/useValidation';
import { getUniqueCodev2 } from 'helpers/Common';
import { Transaction } from 'sequelize/types';
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery';
import schema from 'controllers/Ticket/schema';
import { isEmpty } from 'lodash';
import { validateBoolean } from 'helpers/Common';
import SendMail from 'helpers/SendEmail';
import { ValidationResult } from 'joi';
import Session from 'models/session';
import { SmsVerifySendAttributes, SmsVerifyConfirmAttributes } from 'types/lottery';
import { subtractMinutes } from 'utils/DateTime';
import SmsVerify from 'models/smsverify';
import { Op } from 'sequelize';
import { getRandomInt } from 'utils/Number';
import Playwin from 'models/playwin';
import Ticket from 'models/ticket';

const { APP_NAME } = process.env;

/* const { Sequelize } = db
const { Op } = Sequelize */

const including = [{ model: Session, as: 'session' }];

class TicketService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { filtered } = req.query;
  }

  /**
   * 
   */
  public static async getPlayWinLast(): Promise<Playwin | null> {
    const lastPlayWin = await Playwin.findOne({
      order: [['id', 'DESC']]
    });

    return lastPlayWin;
  }

  /**
   * 
   */
  public static async getGroupTickets(idGroupLottery: number): Promise<Ticket[]> {
    if (!idGroupLottery)
      return [];

    const groupTickets = await Ticket.findAll({
      where: {
        idGroup: idGroupLottery
      }
    });

    return groupTickets;
  }
}

export default TicketService;
