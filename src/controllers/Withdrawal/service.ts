import { WithdrawalReqAttributes, WithdrawalResAttributes } from 'types/lottery';
import ResponseError from 'modules/Response/ResponseError';
import Withdrawal from 'models/withdrawal';
import Paymentmethod from 'models/paymentmethod';

class WithdrawalService { 
  /**
   *
   * @param req Request
   */
  public static async request(loggedInUserId: number, formData: WithdrawalReqAttributes): Promise<WithdrawalResAttributes | null> {
    const prize = await Paymentmethod.getPrizeAccount(loggedInUserId);
    if (!prize)
      throw new ResponseError.BadRequest('Bad request.');
    
    if (!prize.balance || formData.amount > prize.balance)
      throw new ResponseError.BadRequest('Your withdrawable balance is insufficient.');

    await Withdrawal.create({
      accountName: formData.accountName,
      accountNumber: formData.accountNumber.toString(),
      bankName: formData.bankName,      
    });

    return {
      success: true
    };
  }
}

export default WithdrawalService;
