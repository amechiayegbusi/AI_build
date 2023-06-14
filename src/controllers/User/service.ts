import ms from 'ms';
import { Request } from 'express';
import db from 'models/_instance';
import ResponseError from 'modules/Response/ResponseError';
import useValidation from 'helpers/useValidation';
import { getUniqueCodev2 } from 'helpers/Common';
import User from 'models/user';
import { Transaction } from 'sequelize/types';
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery';
import schema from 'controllers/User/schema';
import { isEmpty } from 'lodash';
import { validateBoolean } from 'helpers/Common';
import SendMail from 'helpers/SendEmail';
import { ValidationResult } from 'joi';
import { USER_STATUS } from 'constants/ConstUser';
import Session from 'models/session';
import { SmsVerifySendAttributes, SmsVerifyConfirmAttributes } from 'types/lottery';
import { subtractMinutes } from 'utils/DateTime';
import SmsVerify from 'models/smsverify';
import { Op } from 'sequelize';
import { getRandomInt } from 'utils/Number';

const { APP_NAME } = process.env;

/* const { Sequelize } = db
const { Op } = Sequelize */

const including = [{ model: Session, as: 'session' }];

class UserService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      User,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await User.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await User.count({
      include: includeCount,
      where: queryFind.where,
    })

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   * @param paranoid
   */
  public static async getOne(id: number, paranoid?: boolean) {
    const data = await User.findByPk(id, {
      // include: including,
      paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param id
   * @param paranoid
   */
  /* public static async getUserWithSession(id: number, paranoid?: boolean) {
    const data = await User.findByPk(id, {
      include: includeSession,
      paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  } */

  /**
   *
   * @param id
   * @param paranoid
   * note: find by id only find data not include relation
   */
  public static async findById(id: number, paranoid?: boolean) {
    const data = await User.findByPk(id, { paranoid })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param email
   */
  public static async validateUserEmail(email: string) {
    const data = await User.findOne({ where: { email } })

    if (data) {
      throw new ResponseError.BadRequest('email address already in use')
    }

    return null
  }

  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async create(formData: User, txn?: Transaction) {
    const { error, value }: ValidationResult = useValidation(
      schema.create,
      formData
    )

    const valid =
      error == null || (error && error.details && error.details.length === 0)

    if (!valid) {
      throw new ResponseError.BadRequest('invalid form data to create user')
    }

    const dataUser = await User.create(value, {
      transaction: txn,
    })

    return dataUser
  }

  /**
   *
   * @param id
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async update(
    id: number,
    formData: User,
    txn?: Transaction
  ) {
    const data = await this.findById(id)

    const { error, value }: ValidationResult = useValidation(schema.create, {
      ...data.toJSON(),
      ...formData,
    })

    const valid =
      error == null || (error && error.details && error.details.length === 0)

    if (!valid) {
      throw new ResponseError.BadRequest('invalid form data to update user')
    }

    await data.update(value || {}, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param force - Force Deleted
   */
  public static async delete(id: number, force?: boolean) {
    const data = await this.findById(id);
    const isForce = validateBoolean(force);

    await data.destroy({ force: isForce });
  }

  /**
   *
   * @param id - Restore data from Trash
   */
  public static async restore(id: number) {
    const data = await this.findById(id, false);
    await data.restore();
  }

  /**
   *
   * @param ids
   * @param force
   * @example ids = ['id_1', 'id_2']
   */
  /* public static async multipleDelete(ids: Array<string>, force?: boolean) {
    const isForce = validateBoolean(force)

    if (isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
    }

    await User.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      force: isForce,
    })
  } */

  /**
   *
   * @param ids
   * @example ids = ["id_1", "id_2"]
   */
  /* public static async multipleRestore(ids: Array<string>) {
    await User.restore({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
  } */

  /**
   * 
   */
  public static async sendEmailToResetPassword(email: string) {
    const user = await User.findOne({ where: {
      status: USER_STATUS.STATUS_ACTIVE,
      email: email
    }});

    if (user === null || !user) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted for the email address'
      );
    }

    if (!UserService.isPasswordResetTokenValid(user.passwordResetToken)) {
      user.passwordResetToken = UserService.generatePasswordResetToken();
      await user.save();
    }

    SendMail.ResetPassword({
      email,
      name: user.name as string,
      lname: user.lname as string,
    }, user.passwordResetToken as string);
  }

  /**
   * 
   */
  public static isPasswordResetTokenValid(token: string | null): boolean {
    if (!token)
      return false;

    const expiredStr = process.env.PASSWORD_RESET_TOKEN_EXPIRED || '1h';    // 1 hour
    const expiresIn = ms(expiredStr) / 1000;

    const parts = token.split('_');
    if (!parts || parts.length === 0)
      return false;

    const timestamp = parseInt(parts[parts.length - 1], 10);

    return timestamp + expiresIn >= Math.floor(Date.now() / 1000);
  }

  /**
   * 
   */
  public static generatePasswordResetToken(): string {
    return getUniqueCodev2() + '_' + (Math.floor(Date.now() / 1000)).toString();
  }

  /**
   * 
   */
  public static async smsVerifySend(formData: SmsVerifySendAttributes): Promise<string> {
    if (formData.checkUnique) {
      const user = await User.findByPhoneWithCode(formData.phone);
      if (user) {
        throw new ResponseError.NotFound(
          'The phone number has already used.'
        );
      }
    }

    let fromTime = subtractMinutes(new Date(), 1);
    const smsVerify = await SmsVerify.findOne({
      where: { phone: formData.phone, createdAt: { [Op.gte]: fromTime } },
      order: [['id', 'DESC']]
    });
    if (smsVerify) {
      throw new ResponseError.NotFound(
        'The request failed.'
      );
    }

    const code = getRandomInt(100000, 999999).toString();

    await SmsVerify.create({
      phone: formData.phone,
      code: code
    });

    const content = `Verification Code from ${APP_NAME}: ${code}`;

    // pending ...
    // trying to send SMS

    return content;
  }

  /**
   * 
   */
  public static async smsVerifyConfirm(formData: SmsVerifyConfirmAttributes): Promise<void> {
    let fromTime = subtractMinutes(new Date(), 1);

    const smsVerify = await SmsVerify.findOne({
      where: { phone: formData.phone, createdAt: { [Op.gte]: fromTime } },
      order: [['id', 'DESC']]
    });
    
    if (!smsVerify) {
      throw new ResponseError.BadRequest(
        'The verification failed.'
      );
    }

    if (smsVerify.code != formData.code) {
      throw new ResponseError.BadRequest(
        'The code is wrong.'
      );
    }
  }
}

export default UserService
