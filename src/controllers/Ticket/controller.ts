/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import Authorization from 'middlewares/Authorization';
import JoiValidatorMiddleware from 'middlewares/JoiValidatorMiddleware';
import BuildResponse from 'modules/Response/BuildResponse';
import { arrayFormatter } from 'helpers/Common';
import TicketService from 'controllers/Ticket/service';
import schemaTicket from 'controllers/Ticket/schema';
import User from 'models/user';

routes.get(
  '/ticket/play-win-last',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const data = await TicketService.getPlayWinLast();
    const buildResponse = BuildResponse.get(data);

    return res.status(200).json(buildResponse);
  })
)

routes.get(
  '/tickets/group-tickets',
  Authorization,
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { idGroupLottery } = req.getQuery();
    if (!idGroupLottery) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid group lottery id!',
      });
    }

    const data = await TicketService.getGroupTickets(idGroupLottery);
    const buildResponse = BuildResponse.get(data);

    return res.status(200).json(buildResponse);
  })
)
