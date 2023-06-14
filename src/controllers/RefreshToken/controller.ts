import { Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import Authorization from 'middlewares/Authorization';
import BuildResponse from 'modules/Response/BuildResponse';
import RefreshTokenService from 'controllers/RefreshToken/service';

routes.get(
  '/refresh-token',
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { refreshToken } = req.getQuery()

    const data = await RefreshTokenService.getToken(refreshToken)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
);

