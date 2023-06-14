import { Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import Authorization from 'middlewares/Authorization';
import BuildResponse from 'modules/Response/BuildResponse';
import SessionService from 'controllers/Session/service';

routes.get(
  '/session',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const data = await SessionService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
);

