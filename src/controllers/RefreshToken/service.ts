import ms from 'ms';
import models from 'models';
import jwt from 'jsonwebtoken';
import ResponseError from 'modules/Response/ResponseError';
import {
  RefreshTokenAttributes,
  verifyRefreshTokenAttributes,
} from 'types/lottery';
import schema from 'controllers/RefreshToken/schema';
import UserService from 'controllers/User/service';
import { ValidationResult } from 'joi';
import useValidation from 'helpers/useValidation';
import { verifyRefreshToken } from 'helpers/Token';
import RefreshToken from 'models/refreshtoken';
import { isObject } from 'lodash';

const { JWT_SECRET_ACCESS_TOKEN }: string | any = process.env;
const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED || '1d';

const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED) / 1000;

class RefreshTokenService {
  /**
   *
   * @param token
   */
  public static async getToken(token: string) {
    const data = await RefreshToken.findOne({
      where: { token },
    })

    if (!data) {
      throw new ResponseError.NotFound('token not found or has been deleted')
    }

    return data
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: RefreshTokenAttributes) {
    const { error, value }: ValidationResult = useValidation(
      schema.create,
      formData
    );

    const valid =
      error == null || (error && error.details && error.details.length === 0);

    if (!valid) {
      throw new ResponseError.BadRequest('invalid form data to create refresh token.')
    }

    const user = await UserService.getOne(formData.userId);

    if (user) {
      const data = await RefreshToken.create({
        userId: value.userId,
        token: value.token,
      });
      return data;
    }

    throw new ResponseError.BadRequest('Something went wrong');
  }

  /**
   *
   * @param email
   * @param refreshToken
   */
  public static async getAccessToken(email: string, refreshToken: string) {
    if (!email || !refreshToken) {
      throw new ResponseError.BadRequest('invalid token');
    }

    const getToken = await this.getToken(refreshToken);
    if (getToken === null || !getToken || !getToken.token)
      throw new ResponseError.BadRequest('invalid token');

    const verifyToken = verifyRefreshToken(getToken.token);

    if (isObject(verifyToken?.data)) {
      // @ts-ignore
      const decodeToken: verifyRefreshTokenAttributes = verifyToken?.data;

      if (email !== decodeToken?.email) {
        throw new ResponseError.BadRequest('email is not valid');
      }

      const payloadToken = {
        id: decodeToken?.id,
        name: decodeToken?.name,
        lname: decodeToken?.lname,
        email: decodeToken?.email,
        status: decodeToken?.status,
        authKey: decodeToken?.authKey,
      };

      // Access Token
      const accessToken = jwt.sign(
        JSON.parse(JSON.stringify(payloadToken)),
        JWT_SECRET_ACCESS_TOKEN,
        {
          expiresIn,
        }
      );

      return {
        message: 'Access token has been updated',
        accessToken,
        expiresIn,
        tokenType: 'Bearer',
      };
    }

    throw new ResponseError.Unauthorized(`${verifyToken?.message}`)
  }

  /**
   *
   * @param id
   */
  public static async delete(id: number) {
    await RefreshToken.destroy({
      where: { userId: id },
    })
  }
}

export default RefreshTokenService
