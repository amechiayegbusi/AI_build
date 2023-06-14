/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import JoiValidatorMiddleware from 'middlewares/JoiValidatorMiddleware';
import Authorization from 'middlewares/Authorization';
import BuildResponse from 'modules/Response/BuildResponse';
import WithdrawalService from 'controllers/Withdrawal/service';
import AuthService from 'controllers/Auth/service';
import schemaWithdrawal from 'controllers/Withdrawal/schema';

routes.post(
  '/withdrawal/request',
  JoiValidatorMiddleware(schemaWithdrawal.request),
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const loggedInUserId = await AuthService.getLoggedInUserId(req);
    if (!loggedInUserId) {
      return res.status(401).json({
        code: 401,
        message: 'the login session has ended, please re-login',
      });
    }

    const formData = req.getBody();
    const data = await WithdrawalService.request(loggedInUserId, formData);
    
    const buildResponse = BuildResponse.get(data);

    return res.status(200).json(buildResponse);
  })
)