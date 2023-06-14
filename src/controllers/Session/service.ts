import { Request } from 'express';
import models from 'models';
import ResponseError from 'modules/Response/ResponseError';
import useValidation from 'helpers/useValidation';
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery';
import schema from 'controllers/Session/schema';
import { SessionAttributes } from 'types/lottery';
import Session from 'models/session';
import { ValidationResult } from 'joi';

class SessionService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Session,
      []
    );

    const data = await Session.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    });
    const total = await Session.count({
      include: includeCount,
      where: queryFind.where,
    });

    return { message: `${total} data has been received.`, data, total };
  }

  /**
   *
   * @param id
   */
  public static async getOne(id: number) {
    const data = await Session.findByPk(id);

    if (!data) {
      throw new ResponseError.NotFound(
        'session data not found or has been deleted'
      );
    }

    return data;
  }

  /**
   *
   * @param user_id
   * @param token
   */
  public static async findByTokenUser(userId: number, token: string) {
    const data = await Session.findOne({ where: { userId, token } });

    if (!data) {
      throw new ResponseError.NotFound(
        'the login session has ended, please re-login'
      );
    }

    return data;
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: SessionAttributes) {
    const { error, value }: ValidationResult = useValidation(
      schema.create,
      formData
    );

    const valid =
      error == null || (error && error.details && error.details.length === 0);

    if (!valid) {
      throw new ResponseError.BadRequest('invalid form data to create session.')
    }

    const data = await Session.create({
      userId: value.userId,
      token: value.token,
      ipAddress: value.ipAddress,
      device: value.device,
      platform: value.platform,
    });

    return data;
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: number, formData: SessionAttributes) {
    const data = await this.getOne(id);

    const { error, value }: ValidationResult = useValidation(
      schema.create,
      {
        ...data.toJSON(),
        ...formData,
      }
    );

    const valid =
      error == null || (error && error.details && error.details.length === 0);

    if (!valid) {
      throw new ResponseError.BadRequest('invalid form data to update session.');
    }


    await data.update(value || {});

    return data;
  }

  /**
   *
   * @param user_id
   * @param token
   */
  public static async deleteByTokenUser(userId: number, token: string) {
    await Session.destroy({ where: { userId, token } });
  }

  /**
   *
   * @param id - Force Delete
   */
  public static async delete(id: number) {
    const data = await this.getOne(id);
    await data.destroy();
  }
}

export default SessionService;
