/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import Authorization from 'middlewares/Authorization';
import BuildResponse from 'modules/Response/BuildResponse';
import VipService from 'controllers/Vip/service';

routes.get(
  '/vips',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const data = await VipService.getAll(req);
    const buildResponse = BuildResponse.get(data);

    return res.status(200).json(buildResponse);
  })
)

routes.get(
  '/vip/detail',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { vipId } = req.query;
    if (!vipId || parseInt(vipId.toString(), 10) < 1) {
      return res.status(401).json({
        code: 401,
        message: 'The request parameter - vipId is invalid.',
      });
    }

    const vipIdVal = parseInt(vipId.toString(), 10);

    const vipInfo = await VipService.getDetails(vipIdVal);
    const buildResponse = BuildResponse.get({
      data: vipInfo
    });

    return res.status(200).json(buildResponse);
  })
)