import ms from 'ms';
import { Request } from 'express';
import ResponseError from 'modules/Response/ResponseError';
import { getUniqueCodev2 } from 'helpers/Common';
import jwt from 'jsonwebtoken';
import User from 'models/user';
// import SendMail from 'helpers/SendEmail'
import UserService from 'controllers/User/service';
import RefreshTokenService from 'controllers/RefreshToken/service';
import SessionService from 'controllers/Session/service';
import { USER_FROM_WHERE, USER_STATUS, USER_TYPE } from 'constants/ConstUser';
import { LoginFormAttributes } from 'types/lottery';
import bcrypt, { compare } from 'bcrypt';
import validateEmail from 'utils/ValidateEmail';
import userAgentHelper from 'helpers/userAgent';
import { currentToken, verifyAccessToken } from 'helpers/Token';
import { isEmpty } from 'lodash';
import Session from 'models/session';

const including = [{ model: Session, as: 'session' }];

const { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN }: any = process.env

const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED || '1d' // 1 Days
const JWT_REFRESH_TOKEN_EXPIRED = process.env.JWT_REFRESH_TOKEN_EXPIRED || '30d' // 30 Days

const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED) / 1000

class AuthService {
  /**
   *
   * @param formData
   */
  public static async register(formData: User) {
    // check duplicate email
    await UserService.validateUserEmail(formData.email!);

    const generateToken = {
      authKey: getUniqueCodev2(),
    };

    const tokenVerify = jwt.sign(
      JSON.parse(JSON.stringify(generateToken)),
      JWT_SECRET_ACCESS_TOKEN,
      {
        expiresIn,
      }
    );

    let type = USER_TYPE.TYPE_USER;
    switch (formData.fromWhere) {
      case USER_FROM_WHERE.FROM_WEBSITE:
        type = USER_TYPE.TYPE_USER;
        break
      case USER_FROM_WHERE.FROM_MOBILE:
        type = USER_TYPE.TYPE_REFERRAL;
        break
      case USER_FROM_WHERE.FROM_AGENT:
        type = USER_TYPE.TYPE_AGENT;
        break
      case USER_FROM_WHERE.FROM_ADMIN:
        type = USER_TYPE.TYPE_INFLUENCE;
        break
      default:
        break
    }

    const newFormData = { ...formData, authKey: generateToken.authKey, type, tokenVerify };
    let { password, ...new_ } = newFormData;
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password!, saltRounds);
    new_ = { ...new_, passwordHash: hash};
    
    await User.create(new_);

    // Initial Send an e-mail
    // SendMail.AccountRegister(formData, authKey)

    return {
      message:
        'registration is successful, check your email for the next steps',
    };
  }

  /**
   *
   * @param formData
   */
  public static async login(req: Request, formData: LoginFormAttributes): Promise<any> {
    const { clientIp, useragent } = req;

    // check duplicate email
    const loginType = formData.loginType;   // 0: user, 1: admin, 2: agent
    if (loginType === 1) {    // admin
      const idUser = formData.idUser;
      if (!idUser)
        throw new ResponseError.NotFound('This email/phone does not exist.');
      
      const user = await User.findByPk(idUser);
      if (user === null || !user)
        throw new ResponseError.NotFound('This email/phone does not exist.');

      const userInfo = {
        id: user.id,
        name: user.name,
        lname: user.lname,
        email: user.email,
        status: user.status,
      };

      return userInfo;
    }

    let user = null;

    const emailOrPhone = formData.email;
    if (validateEmail(emailOrPhone)) {
      user = await User.findByEmail(emailOrPhone);
    } else {
      user = await User.findByPhoneWithCode(emailOrPhone);
    }

    if (user === null || !user)
      throw new ResponseError.NotFound('This email/phone does not exist. Please register.');
    
    if (loginType === 2) {      // agent
      if (user.type !== USER_TYPE.TYPE_AGENT)
        throw new ResponseError.BadRequest('The user is not agent.');
    }

    // for migration user or reset password user
    if (user.migrate === 1 || user.resetPassword === 0) {
      return {
        'migrated_user': user.authKey
      };
    }
    // for migration or reset password user
    
    if (user.status !== USER_STATUS.STATUS_ACTIVE)
      throw new ResponseError.NotFound('This user is deactivated.');
    
    const comparePassword = await user.comparePassword(formData.password);
    if (comparePassword) {      
      const payloadToken = {
        id: user.id,
        name: user.name,
        lname: user.lname,
        email: user.email,
        status: user.status,
        authKey: user.authKey,
      };

      // Access Token
      const accessToken = jwt.sign(
        JSON.parse(JSON.stringify(payloadToken)),
        JWT_SECRET_ACCESS_TOKEN,
        {
          expiresIn,
        }
      );

      // Refresh Token
      const refreshToken = jwt.sign(
        JSON.parse(JSON.stringify(payloadToken)),
        JWT_SECRET_REFRESH_TOKEN,
        {
          expiresIn: JWT_REFRESH_TOKEN_EXPIRED,
        }
      );

      // create refresh token
      await RefreshTokenService.create({
        userId: user.id,
        token: refreshToken,
      });

      // create session
      await SessionService.create({
        userId: user.id,
        token: accessToken,
        ipAddress: clientIp?.replace('::ffff:', ''),
        device: userAgentHelper.currentDevice(req),
        platform: `${useragent?.os} - ${useragent?.platform}`,
      });

      return {
        message: 'Login successfully',
        accessToken,
        expiresIn,
        tokenType: 'Bearer',
        refreshToken,
        user: payloadToken,
      };
    }

    throw new ResponseError.BadRequest('incorrect email or password!');
  }

  /**
   *
   * @param userId
   * @param token
   */
  public static async verifySession(userId: number, token: string) {
    const sessionUser = await SessionService.findByTokenUser(userId, token);
    if (!sessionUser.token)
      return null;

    const verifyToken = verifyAccessToken(sessionUser.token);
    if (!verifyToken)
      return null;

    if (!verifyToken.data || !isEmpty(verifyToken.data)) {
      // @ts-ignore
      const data = await User.findByPk(verifyToken?.data?.id, {
        include: including,
      })
      return data
    }

    return null
  }

  /**
   *
   * @param token
   */
  public static async profile(userData: User) {
    const data = await User.findByPk(userData.id, {
      include: including
    });

    return data;
  }

  /**
   *
   * @param userId
   * @param userData
   * @param token
   */
  public static async logout(userId: number, userData: any, token: string) {
    if (userData?.id !== userId)
      throw new ResponseError.Unauthorized('Invalid user login!');
    
    const data = await UserService.getOne(userId);
    if (data === null || !data)
      throw new ResponseError.Unauthorized('Invalid user login!');

    // clean refresh token & session
    await RefreshTokenService.delete(data.id);
    await SessionService.deleteByTokenUser(data.id, token);

    const message = 'You have logged out of the application';

    return message;
  }

  /**
   *
   * @param req
   */
  public static async getLoggedInUserId(req: Request): Promise<number | null> {
    const userData = req.getState('userLogin');
    const getToken = currentToken(req);

    const data = await AuthService.verifySession(userData.id, getToken);
    if (data === null || !data)
      return null;

    const userInfo = await User.findByPk(userData.id, {
      // include: including
    });

    if (userInfo === null || !userInfo)
      return null;

    return userInfo.id;
  }

  /**
   *
   * @param req
   */
  public static async getLoggedInUser(req: Request): Promise<User | null> {
    const userData = req.getState('userLogin');
    const getToken = currentToken(req);

    const data = await AuthService.verifySession(userData.id, getToken);
    if (data === null || !data)
      return null;

    const userInfo = await User.findByPk(userData.id, {
      // include: including
    });

    if (userInfo === null || !userInfo)
      return null;

    return userInfo;
  }
}

export default AuthService
