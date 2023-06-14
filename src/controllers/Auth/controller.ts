import { Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import JoiValidatorMiddleware from 'middlewares/JoiValidatorMiddleware';
import AlreadyLoggedIn from 'middlewares/AlreadyLoggedIn';
import Authorization from 'middlewares/Authorization';
import BuildResponse from 'modules/Response/BuildResponse';
import ResponseError from 'modules/Response/ResponseError';
import schemaAuth from 'controllers/Auth/schema';
import AuthService from 'controllers/Auth/service';
import RefreshTokenService from 'controllers/RefreshToken/service';
import { currentToken } from 'helpers/Token';

routes.post(
  '/register',
  JoiValidatorMiddleware(schemaAuth.register),
  AlreadyLoggedIn,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const formData = req.getBody();
    const data = await AuthService.register(formData);
    const buildResponse = BuildResponse.get(data);

    return res.status(201).json(buildResponse);
  })
)

routes.post(
  '/login',
  JoiValidatorMiddleware(schemaAuth.login),
  AlreadyLoggedIn,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const formData = req.getBody();
    const data = await AuthService.login(req, formData);
    if (data === null || !data)
      throw new ResponseError.BadRequest('Incorrect email or password!');

    if (!data.accessToken || !data.expiresIn)
      throw new ResponseError.BadRequest('Incorrect email or password!');

    const buildResponse = BuildResponse.get(data);

    return res
      .cookie('token', data.accessToken, {
        maxAge: Number(data.expiresIn) * 1000, // 7 Days
        httpOnly: true,
        path: '/v1',
        secure: process.env.NODE_ENV === 'production',
      })
      .json(buildResponse)
  })
)

routes.post(
  '/refresh-token',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { email, refreshToken } = req.getBody();

    const data = await RefreshTokenService.getAccessToken(email, refreshToken);
    const buildResponse = BuildResponse.get(data);

    return res.status(200).json(buildResponse);
  })
)

routes.get(
  '/profile',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userData = req.getState('userLogin');
    const getToken = currentToken(req);

    const data = await AuthService.verifySession(userData.id, getToken);
    if (data === null || !data) {
      return res.status(401).json({
        code: 401,
        message: 'the login session has ended, please re-login',
      });
    }
    
    const profile = await AuthService.profile(userData);
    const buildResponse = BuildResponse.get({ profile });

    return res.status(200).json(buildResponse);
  })
)

routes.get(
  '/verify-session',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userData = req.getState('userLogin');
    const getToken = currentToken(req);

    const data = await AuthService.verifySession(userData.id, getToken);
    if (data === null || !data) {
      return res.status(401).json({
        code: 401,
        message: 'the login session has ended, please re-login',
      });
    }

    const buildResponse = BuildResponse.get({ data });

    return res.status(200).json(buildResponse);
  })
)

routes.post(
  '/logout',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.getBody();
    const userData = req.getState('userLogin');
    const getToken = currentToken(req);

    const message = await AuthService.logout(userId, userData, getToken);
    const buildResponse = BuildResponse.deleted({ message });

    return res.clearCookie('token', { path: '/v1' }).json(buildResponse);
  })
)
