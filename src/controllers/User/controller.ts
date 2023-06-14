/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import Authorization from 'middlewares/Authorization';
import JoiValidatorMiddleware from 'middlewares/JoiValidatorMiddleware';
import BuildResponse from 'modules/Response/BuildResponse';
import UserService from 'controllers/User/service';
import { arrayFormatter } from 'helpers/Common';
import AuthService from 'controllers/Auth/service';
import schemaUser from 'controllers/User/schema';
import User from 'models/user';

routes.get(
  '/user',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const data = await UserService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

/* routes.get(
  '/user/:id/session',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.getParams()

    const data = await UserService.getUserWithSession(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
) */

routes.get(
  '/user/:id',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.getParams()

    const data = await UserService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

/* routes.post(
  '/user/multiple/soft-delete',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleDelete(arrayIds)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/user/multiple/restore',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleRestore(arrayIds)
    const buildResponse = BuildResponse.updated({})

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/user/multiple/force-delete',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleDelete(arrayIds, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
) */

routes.post(
  '/users/password-reset-request',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const loggedInUserId = await AuthService.getLoggedInUserId(req);
    if (!loggedInUserId) {
      return res.status(401).json({
        code: 401,
        message: 'the login session has ended, please re-login',
      });
    }

    const userData = req.getState('userLogin');
    const profile = await AuthService.profile(userData);
    if (!profile) {
      return res.status(400).json({
        code: 400,
        message: 'the login session has ended, please re-login',
      });
    }
    
    await UserService.sendEmailToResetPassword(profile.email as string);
    
    const buildResponse = BuildResponse.created({});

    return res.status(200).json(buildResponse);
  })
)

routes.delete(
  '/user/delete/:id',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.getParams()

    await UserService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/user/restore/:id',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.getParams()

    await UserService.restore(id)
    const buildResponse = BuildResponse.updated({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/user/:id',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.getParams();

    await UserService.delete(id, true);
    const buildResponse = BuildResponse.deleted({});

    return res.status(200).json(buildResponse);
  })
)

routes.post(
  '/users/sms-verify-send',
  JoiValidatorMiddleware(schemaUser.smsVerifySend),
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {        
    const formData = req.getBody();
    const message = await UserService.smsVerifySend(formData);
    
    const buildResponse = BuildResponse.created({ message });

    return res.status(200).json(buildResponse);
  })
)

routes.post(
  '/users/sms-verify-confirm',
  JoiValidatorMiddleware(schemaUser.smsVerifyConfirm),
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {        
    const formData = req.getBody();
    await UserService.smsVerifyConfirm(formData);
    
    const buildResponse = BuildResponse.created({});

    return res.status(200).json(buildResponse);
  })
)
