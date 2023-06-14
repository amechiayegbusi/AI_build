/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import JoiValidatorMiddleware from 'middlewares/JoiValidatorMiddleware';
import Authorization from 'middlewares/Authorization';
import BuildResponse from 'modules/Response/BuildResponse';
import VoucherService from 'controllers/Voucher/service';
import AuthService from 'controllers/Auth/service';
import schemaVoucher from 'controllers/Voucher/schema';

routes.get(
  '/vouchers',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const loggedInUserId = await AuthService.getLoggedInUserId(req);
    if (!loggedInUserId) {
      return res.status(401).json({
        code: 401,
        message: 'the login session has ended, please re-login',
      });
    }

    const data = await VoucherService.getAll(loggedInUserId);
    const buildResponse = BuildResponse.get(data);

    return res.status(200).json(buildResponse);
  })
)

routes.post(
  '/voucher/apply',
  JoiValidatorMiddleware(schemaVoucher.apply),
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
    const data = await VoucherService.applyVoucher(loggedInUserId, formData);
    
    const buildResponse = BuildResponse.get(data);

    return res.status(200).json(buildResponse);
  })
)