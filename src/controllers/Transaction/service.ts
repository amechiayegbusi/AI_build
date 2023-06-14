import { Request } from 'express';
import { Op, FindOptions, Attributes } from 'sequelize';
import { TransactionSearchAttributes } from 'types/api';
import AuthService from 'controllers/Auth/service';
import Transaction from 'models/transaction';
import { USER_ROLE } from 'constants/ConstUser';
import { TRANSACTION_STATUS, TRANSACTION_TYPE, TRANSACTION_AGGREGATE } from 'constants/ConstTransaction';
import Paymentmethod from 'models/paymentmethod';

class TransactionService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { filtered } = req.query;    
  }

  /**
   * 
   */
  public static async search(req: Request, searchParams: TransactionSearchAttributes): Promise<Transaction[]> {
    const loggedInUser = await AuthService.getLoggedInUser(req);
    if (!loggedInUser)
      return [];

    if (loggedInUser.role && loggedInUser.role <= USER_ROLE.ROLE_USER)
      searchParams.idUser = loggedInUser.role;

    const type = !searchParams.type ? '' : searchParams.type;

    let typesInWhere: string[] = [];

    if (searchParams.aggregateType && searchParams.aggregateType === TRANSACTION_AGGREGATE.AGGREGATE_TYPE_DEPOSIT) {
      typesInWhere.push(TRANSACTION_TYPE.TYPE_PRIZE);
      typesInWhere.push(TRANSACTION_TYPE.TYPE_ADD);
    }

    if (searchParams.aggregateType && searchParams.aggregateType === TRANSACTION_AGGREGATE.AGGREGATE_TYPE_WITHDRAW) {
      typesInWhere.push(TRANSACTION_TYPE.TYPE_WITHDRAW);
      typesInWhere.push(TRANSACTION_TYPE.TYPE_CHARGE);
    }

    let findOptions: FindOptions<Attributes<Transaction>> = {
      include: [{ model: Paymentmethod, as: 'paymentmethod' }],
      where: {
        status: TRANSACTION_STATUS.STATUS_SUCCESS,
        [Op.and]: [
          { type: type.replace(TRANSACTION_AGGREGATE.AGGREGATE_TYPE_DEPOSIT, TRANSACTION_TYPE.TYPE_ADD) },
          {
            type: {
              [Op.ne]: TRANSACTION_TYPE.TYPE_MOVE_BONUS,
              [Op.in]: typesInWhere
            }
          }
        ],
        '$paymentmethod.userId$': searchParams.idUser
      },
      order: [
        ['date', 'DESC'],
        ['id', 'DESC']
      ],
    };

    if (searchParams.limit)
      findOptions.limit = searchParams.limit;

    const transactions = await Transaction.findAll(findOptions);

    return transactions;
  }
}

export default TransactionService;
