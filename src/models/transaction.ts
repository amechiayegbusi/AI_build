import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,  
} from 'sequelize';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import db from './_instance';
import { USER_TYPE } from 'constants/ConstUser';
import { PAYMENT_METHOD, PAYMENT_METHOD_CONFIG } from 'constants/ConstPaymentmethod';
import { VOUCHER_WHERE_TYPE, VOUCHER_MONEY_TYPE, VOUCHER_BONUS_TYPE, VOUCHER_LOTTERY_TYPE, VOUCHER_DATE_STATUS, VOUCHER_REDEEM_STATUS } from 'constants/ConstVoucher';
import { ADMIN_BONUS_SETTING } from 'constants/ConstAdminSetting';
import { TRANSACTION_STATUS, TRANSACTION_TYPE, TRANSACTION_BONUS, TRANSACTION_AGGREGATE } from 'constants/ConstTransaction';
import { ResponseAttributes } from 'types/api';

import Draw from './draw';
import Order from './order';
// import Manager from './manager';
import Paymentmethod from './paymentmethod';
import Paymentmethodconfig from './paymentmethodconfig';
import Setting from './setting';
import Terminal from './terminal';
import Ticket from './ticket';
import User from './user';
import Voucheruser from './voucheruser';
import Withdrawal from './withdrawal';

type TransactionAttributes = {
  idUser: number | null;
  idPaymentMethod: number | null;
  amount: number | null;
  status: string | null;
  type: string | null;
  bonusType: string | null;
  paymentRef: string | null;
  idPaymentMethodConfig: number | null;
  description: string | null;
  idObjector: number | null;
  idObjectorPaymentMethod: number | null;
  idRef: number | null;
  date: Date;
  idOrder: number | null;
  orderNo: string | null;
  logId: string | null;
  idWithdrawal: number | null;
  idDraw: number | null;
  idPlaywin: number | null;
  idVoucherUser: number | null;
  idAgent: number | null;
  idTerminal: number | null;
  idManager: number | null;
  reason: string | null;
};

type BalanceAttributes = {
  virtual: number | null;
  bonus: number | null;
  prize: number | null;
};

class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<number>;

  declare idUser: number | null;

  declare idPaymentMethod: number | null;

  declare amount: number | null;

  declare status: string | null;

  declare type: string | null;

  declare bonusType: string | null;

  declare paymentRef: string | null;

  declare idPaymentMethodConfig: number | null;

  declare description: string | null;

  declare idObjector: number | null;

  declare idObjectorPaymentMethod: number | null;

  declare idRef: number | null;

  declare date: Date;

  declare idOrder: number | null;

  declare orderNo: string | null;

  declare logId: string | null;

  declare idWithdrawal: number | null;

  declare idDraw: number | null;

  declare idPlaywin: number | null;

  declare idVoucherUser: number | null;

  declare idAgent: number | null;

  declare idTerminal: number | null;

  declare idManager: number | null;

  declare reason: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare draw?: NonAttribute<Draw> | null;

  // declare manager?: NonAttribute<Manager> | null;

  // declare order?: NonAttribute<Order> | null;

  declare paymentmethod?: NonAttribute<Paymentmethod | null>;

  declare paymentMethodConfig?: NonAttribute<Paymentmethodconfig | null>;

  declare terminal?: NonAttribute<Terminal | null>;

  declare ticket?: NonAttribute<Ticket | null>;

  declare user?: NonAttribute<User | null>;

  declare voucheruser?: NonAttribute<Voucheruser | null>;

  declare withdrawal?: NonAttribute<Withdrawal | null>;

  declare balance?: NonAttribute<number | null>;

  declare static associations: {
    draw: Association<Transaction, Draw>;
    paymentmethod: Association<Transaction, Paymentmethod>;
    paymentMethodConfig: Association<Transaction, Paymentmethodconfig>;
    terminal: Association<Transaction, Terminal>;
    ticket: Association<Transaction, Ticket>;
    user: Association<Transaction, User>;
    voucheruser: Association<Transaction, Voucheruser>;
    withdrawal: Association<Transaction, Withdrawal>;
  };

  get referralNo(): NonAttribute<string> {
    return '';
  }

  get typeUp(): NonAttribute<string | null> {
    if (this.type === TRANSACTION_TYPE.TYPE_ADD || this.type === TRANSACTION_TYPE.TYPE_DEPOSIT_AGENT_USER)
      return 'deposit';
    else if (this.type === TRANSACTION_TYPE.TYPE_CHARGE)
      return 'charge';
    else if (this.type === TRANSACTION_TYPE.TYPE_WITHDRAW)
      return 'withdrawal';
    else if (this.type === TRANSACTION_TYPE.TYPE_REVERSAL)
      return 'reversal';
    else if (this.type === TRANSACTION_TYPE.TYPE_PRIZE)
      return 'prize';
    else if (this.type === TRANSACTION_TYPE.TYPE_MOVE_BONUS)
      return 'move bonus';
    else if (this.type === TRANSACTION_TYPE.TYPE_MOVE_PRIZE)
      return 'move prize';
    else if (this.type === TRANSACTION_TYPE.TYPE_COMMISSION_AGENT || this.type === TRANSACTION_TYPE.TYPE_COMMISSION_REFERRAL)
      return 'commission';
    else if (this.type === TRANSACTION_TYPE.TYPE_VOUCHER)
      return 'voucher bonus';
    else if (this.type === TRANSACTION_TYPE.TYPE_SYSTEM)
      return 'system bonus';

    return this.type;
  }

  get aggregateType(): NonAttribute<string | null> {
    switch (this.type) {
      case TRANSACTION_TYPE.TYPE_ADD:
      case TRANSACTION_TYPE.TYPE_DEPOSIT_AGENT_USER:
      case TRANSACTION_TYPE.TYPE_PRIZE:
      case TRANSACTION_TYPE.TYPE_VOUCHER:
      case TRANSACTION_TYPE.TYPE_SYSTEM:
      case TRANSACTION_TYPE.TYPE_COMMISSION_AGENT:
      case TRANSACTION_TYPE.TYPE_COMMISSION_REFERRAL:
        return TRANSACTION_AGGREGATE.AGGREGATE_TYPE_DEPOSIT;
      
      case TRANSACTION_TYPE.TYPE_CHARGE:
      case TRANSACTION_TYPE.TYPE_WITHDRAW:
      case TRANSACTION_TYPE.TYPE_REVERSAL:
        return TRANSACTION_AGGREGATE.AGGREGATE_TYPE_WITHDRAW;

      case TRANSACTION_TYPE.TYPE_REFUND:
        return TRANSACTION_AGGREGATE.AGGREGATE_TYPE_REFUND;
    
      default:
        return ('unknown type ').concat(!this.type ? '' : this.type);
    }
  };

  get amountWithSign(): NonAttribute<number | null> {
    if (this.aggregateType === TRANSACTION_AGGREGATE.AGGREGATE_TYPE_WITHDRAW) {
      if (this.amount)
        return -1 * this.amount;
      else
        return null;
    }

    return this.amount;
  }

  get descriptions(): NonAttribute<string | null> {
    switch (this.type) {
      case TRANSACTION_TYPE.TYPE_ADD:
        if (this.idPaymentMethodConfig)
          return ('Deposit via ').concat(this.paymentMethodConfig && this.paymentMethodConfig.label ? this.paymentMethodConfig.label : '');        
        return '';
      
      case TRANSACTION_TYPE.TYPE_DEPOSIT_AGENT_USER:
        return 'Deposit via agent';

      case TRANSACTION_TYPE.TYPE_PRIZE:
        return 'Prize for a draw';

      case TRANSACTION_TYPE.TYPE_CHARGE:
        return 'Charge for a ticket';
      
      case TRANSACTION_TYPE.TYPE_WITHDRAW:
        return 'Withdrawal';

      case TRANSACTION_TYPE.TYPE_VOUCHER:
        return 'Bonus by voucher';

      case TRANSACTION_TYPE.TYPE_SYSTEM:
        return 'Bonus by system';

      case TRANSACTION_TYPE.TYPE_COMMISSION_REFERRAL:
        return 'Commission for referral user';

      case TRANSACTION_TYPE.TYPE_COMMISSION_AGENT:
        return 'Commission for agent';
    
      default:
        break;
    }

    return this.description;
  }

  charge = async (idPlayer: number, amount: number, idOrder: number, idVoucherUser: number = 0): Promise<number | null> => {
    /* const order = await Order.findByPk(idOrder);
    if (order === null || !order)
      return null; */

    amount = parseInt(amount.toString(), 10);
    if (isNaN(amount))
      return null;

    // get user bonus wallet id from PaymentMethod
    const bonusAccount = await Paymentmethod.findOne({
      where: {
        userId: idPlayer,
        type: PAYMENT_METHOD.TYPE_BONUS,
      }
    });
    if (bonusAccount === null || !bonusAccount)
      return null;

    // get user wallet id from PaymentMethod
    const account = await Paymentmethod.findOne({
      where: {
        userId: idPlayer,
        type: PAYMENT_METHOD.TYPE_BONUS,
      }
    });
    if (account === null || !account)
      return null;

    // get user prize wallet id from PaymentMethod
    const prizeAccount = await Paymentmethod.findOne({
      where: {
        userId: idPlayer,
        type: PAYMENT_METHOD.TYPE_PRIZE,
      }
    });
    if (prizeAccount === null || !prizeAccount)
      return null;

    const bonusBalance = bonusAccount.balance ? bonusAccount.balance : 0;
    const balance = account.balance ? account.balance : 0;
    const prizeBalance = prizeAccount.balance ? prizeAccount.balance : 0;

    // transfer from bonus to virtual balance
    if (
      bonusBalance > 0 &&
      bonusBalance < amount &&
      balance + bonusBalance >= amount
    ) {
      if (account.balance)
        account.balance += bonusBalance;
      else
        account.balance = bonusBalance;

      if (bonusAccount.balance)
        bonusAccount.balance -= bonusBalance;        
      else
        bonusAccount.balance = bonusBalance;

      await account.save();
      await bonusAccount.save();

      await Transaction.create({
        idUser: idPlayer,
        idPaymentMethod: account.id,
        type: TRANSACTION_TYPE.TYPE_MOVE_BONUS,
        amount: bonusBalance,
        status: TRANSACTION_STATUS.STATUS_SUCCESS,
        date: new Date(),
      });
    }

    // transfer from prize to virtual balance
    if (
      bonusBalance <= 0 &&
      balance < amount &&
      balance + prizeBalance >= amount
    ) {
      const prizeMoveBalance = amount - balance;

      if (account.balance)
        account.balance += prizeMoveBalance;
      else
        account.balance = prizeMoveBalance;

      if (prizeAccount.balance)  
        prizeAccount.balance -= prizeMoveBalance;
      
      await account.save();
      await prizeAccount.save();

      await Transaction.create({
        idUser: idPlayer,
        idPaymentMethod: account.id,
        type: TRANSACTION_TYPE.TYPE_MOVE_PRIZE,
        amount: prizeMoveBalance,
        status: TRANSACTION_STATUS.STATUS_SUCCESS,
        date: new Date(),
      });
    }

    // transfer from bonus and prize to virtual balance
    if (
      bonusBalance > 0 &&
      bonusBalance < amount &&
      balance + bonusBalance < amount &&
      balance + bonusBalance + prizeBalance >= amount
    ) {
      const prizeMoveBalance = amount - (balance + bonusBalance);

      if (account.balance)
        account.balance += bonusBalance;
      else
        account.balance = bonusBalance;

      if (bonusAccount.balance)  
        bonusAccount.balance -= bonusBalance;

      await account.save();
      await bonusAccount.save();

      await Transaction.create({
        idUser: idPlayer,
        idPaymentMethod: account.id,
        type: TRANSACTION_TYPE.TYPE_MOVE_BONUS,
        amount: bonusBalance,
        status: TRANSACTION_STATUS.STATUS_SUCCESS,
        date: new Date(),
      });

      if (account.balance)
        account.balance += prizeMoveBalance;
      else
        account.balance = prizeMoveBalance;

      if (prizeAccount.balance)
        prizeAccount.balance -= prizeMoveBalance;

      await account.save();
      await prizeAccount.save();

      await Transaction.create({
        idUser: idPlayer,
        idPaymentMethod: account.id,
        type: TRANSACTION_TYPE.TYPE_MOVE_PRIZE,
        amount: prizeMoveBalance,
        status: TRANSACTION_STATUS.STATUS_SUCCESS,
        date: new Date(),
      });
    }

    // check balance
    if (balance + bonusBalance + prizeBalance < amount) {
      this.idUser = idPlayer;
      this.idPaymentMethod = account.id;
      this.type = TRANSACTION_TYPE.TYPE_CHARGE;
      this.amount = amount;
      this.status = TRANSACTION_STATUS.STATUS_SUCCESS;
      this.idOrder = idOrder;
      this.date = new Date();

      /* if (order.idAgent) {
        this.idAgent = order.idAgent;
        this.idTerminal = order.idTerminal;
        this.idObjector = order.idUser;
      } */

      await this.save();

      return 0;
    } else {
      let paymentMethod = account;
      if (bonusBalance >= amount)
        paymentMethod = bonusAccount;
      else if (bonusBalance <= 0 && balance <= 0)
        paymentMethod = prizeAccount;

      if (paymentMethod.balance)
        paymentMethod.balance -= amount;

      await paymentMethod.save();

      this.idUser = idPlayer;
      this.idPaymentMethod = paymentMethod.id;
      this.type = TRANSACTION_TYPE.TYPE_CHARGE;
      this.amount = amount;
      this.status = TRANSACTION_STATUS.STATUS_SUCCESS;
      this.idOrder = idOrder;

      if (idVoucherUser)
        this.idVoucherUser = idVoucherUser;
      
      /* if (order.idAgent) {
        this.idAgent = order.idAgent;
        this.idTerminal = order.idTerminal;
        this.idObjector = order.idUser;
      } */

      await this.save();

      this.balance = balance + bonusBalance + prizeBalance;

      return this.id;
    }
  }

  addBonus = async (
    type: string, bonusType: string, idUser: number, amount: number, idRef: number = 0,
    idOrder: number = 0, idVoucherUser: number = 0, isBonusPay: boolean = false): Promise<void> =>
  {
    amount = parseInt(amount.toString(), 10);
    if (isNaN(amount))
      return;

    const bonusAccount = await Paymentmethod.getBonusAccount(idUser);
    const virtualAccount = await Paymentmethod.getVirtualAccount(idUser);

    if (!bonusAccount || !virtualAccount)
      return;

    let paymentMethod = virtualAccount;
    if (isBonusPay)
      paymentMethod = bonusAccount;

    let transactionData = {
      idUser: idUser,
      idPaymentMethod: paymentMethod.id,
      amount: amount,
      status: TRANSACTION_STATUS.STATUS_SUCCESS,
      type: type,
      bonusType: bonusType,      
      paymentRef: this.paymentRef,
      idPaymentMethodConfig: this.idPaymentMethodConfig,
      description: this.description,
      idObjector: this.idObjector,
      idObjectorPaymentMethod: this.idObjectorPaymentMethod,
      idRef: 0,
      date: new Date,
      idOrder: 0,
      orderNo: this.orderNo,
      logId: this.logId,
      idWithdrawal: this.idWithdrawal,
      idDraw: this.idDraw,
      idPlaywin: this.idPlaywin,
      idVoucherUser: 0,
      idAgent: this.idAgent,
      idTerminal: this.idTerminal,
      idManager: this.idManager,
      reason: this.reason,
    };

    if (idRef)
      transactionData.idRef = idRef;
    
    if (idOrder)
      transactionData.idOrder = idOrder;

    if (idVoucherUser) {
      transactionData.idVoucherUser = idVoucherUser;

      if (this.voucheruser) {
        if (this.voucheruser.usageCount)
          this.voucheruser.usageCount += 1;
        else
          this.voucheruser.usageCount = 1;

        await this.voucheruser.save();
      }
    }

    await Transaction.create(transactionData);
  }

  addCommission = async (type: string, bonusType: string, idUser: number, amount: number,
    commissionPercent: number, idObjector: number, idRef: number, idOrder: number): Promise<boolean> =>
  {
    if (
      !type || !bonusType || !idUser ||
      !amount || isNaN(parseInt(amount.toString(), 10)) || parseInt(amount.toString(), 10) <= 0 ||
      !commissionPercent || isNaN(parseInt(commissionPercent.toString(), 10)) || parseInt(commissionPercent.toString(), 10) <= 0 ||
      !idObjector || !idRef || !idOrder
    ) {
      return false;
    }

    /* const order = await Order.findByPk(idOrder);
    if (order === null || !order)
      return false; */

    const commissionAmount = Math.floor(parseFloat((amount * commissionPercent).toString()) / 100.0);

    const bonusAccount = await Paymentmethod.getBonusAccount(idUser);
    if (bonusAccount === null || !bonusAccount)
      return false;

    let transactionData = {
      idUser: idUser,
      idPaymentMethod: bonusAccount.id,
      type: type,
      bonusType: bonusType,
      amount: commissionAmount,
      idObjector: idObjector,
      idRef: idRef,
      idOrder: idOrder,
      status: TRANSACTION_STATUS.STATUS_SUCCESS,
      idAgent: 0,
      idTerminal: 0,
      date: new Date(),
    };

    /* if (order.idAgent) {
      transactionData.idAgent = order.idAgent;
      transactionData.idTerminal = order.idTerminal;
    } */

    await Transaction.create(transactionData);

    return true;
  }

  checkAvailableBalance = async (idUser: number, amount: number): Promise<number> => {
    amount = parseInt(amount.toString(), 10);

    const bonusAccount = await Paymentmethod.getBonusAccount(idUser);
    if (bonusAccount === null || !bonusAccount)
      return 0;

    const account = await Paymentmethod.getVirtualAccount(idUser);
    if (account === null || !account)
      return 0;

    const prizeAccount = await Paymentmethod.getPrizeAccount(idUser);
    if (prizeAccount === null || !prizeAccount)
      return 0;

    const balance = !account.balance ? 0 : account.balance;
    const bonusBalance = !bonusAccount.balance ? 0 : bonusAccount.balance;
    const prizeBalance = !prizeAccount.balance ? 0 : prizeAccount.balance;

    if (balance + bonusBalance + prizeBalance < amount)
      return 0;
    
    return balance + bonusBalance + prizeBalance;
  }

  refund = async (idLottery: number, amount: number): Promise<void> => {
    await Transaction.create({
      idUser: this.idUser,
      idPaymentMethod: this.idPaymentMethod,
      amount: amount,
      status: this.status,
      type: TRANSACTION_TYPE.TYPE_REFUND,
      bonusType: this.bonusType,
      paymentRef: this.paymentRef,
      idPaymentMethodConfig: this.idPaymentMethodConfig,
      description: this.description,
      idObjector: this.idObjector,
      idObjectorPaymentMethod: this.idObjectorPaymentMethod,
      idRef: this.idRef,
      date: new Date,
      idOrder: this.idOrder,
      orderNo: this.orderNo,
      logId: this.logId,
      idWithdrawal: this.idWithdrawal,
      idDraw: this.idDraw,
      idPlaywin: this.idPlaywin,
      idVoucherUser: 0,
      idAgent: this.idAgent,
      idTerminal: this.idTerminal,
      idManager: this.idManager,
      reason: this.reason,
    });
  }

  prize = async (data: TransactionAttributes) => {
    this.idUser = data.idUser;
    this.idPaymentMethod = data.idPaymentMethod;
    this.amount = data.amount;
    this.status = data.status;
    this.type = data.type;
    this.bonusType = data.bonusType;
    this.paymentRef = data.paymentRef;
    this.idPaymentMethodConfig = data.idPaymentMethodConfig;
    this.description = data.description;
    this.idObjector = data.idObjector;
    this.idObjectorPaymentMethod = data.idObjectorPaymentMethod;
    this.idRef = data.idRef;
    this.date = data.date;
    this.idOrder = data.idOrder;
    this.orderNo = data.orderNo;
    this.logId = data.logId;
    this.idWithdrawal = data.idWithdrawal;
    this.idDraw = data.idDraw;
    this.idPlaywin = data.idPlaywin;
    this.idVoucherUser = data.idVoucherUser;
    this.idAgent = data.idAgent;
    this.idTerminal = data.idTerminal;
    this.idManager = data.idManager;
    this.reason = data.reason;

    return Transaction.balance();
  }

  static balance = async (idUser: number = 0): Promise<BalanceAttributes> => {
    /* if (loggedInUser.isGuest) {
      return {
        virtual: 0,
        bonus: 0
      };
    }

    if (!idUser) {
      idUser = loggedInUser.id;
    } */

    const virtual = await Paymentmethod.getVirtualAccount(idUser);
    const bonus = await Paymentmethod.getBonusAccount(idUser);
    const prize = await Paymentmethod.getPrizeAccount(idUser);

    return {
      virtual: virtual && virtual.balance ? virtual.balance : 0,
      bonus: bonus && bonus.balance ? bonus.balance : 0,
      prize: prize && prize.balance ? prize.balance : 0
    };
  }

  static lastUserTransaction = async (count: number): Promise<void> => {
    // pending ...
  }

  static verifyTransactions = async (transaction: TransactionAttributes): Promise<ResponseAttributes | null> => {
    if (transaction === null || !transaction)
      return null;

    /* if (transaction.paymentMethodConfig === null || !this.paymentMethodConfig)
      return null; */

    // pending ...   

    return null;
  }

  static deleteOldPending = async (): Promise<[undefined, number]> => {
    const result = await db.sequelize.query(
      'DELETE FROM transaction WHERE status = $status AND date < DATE_ADD(now(), interval -45 day)',
      {
        bind: { status: TRANSACTION_STATUS.STATUS_PENDING },
      }
    );

    return result;
  }
}

Transaction.init(
  {
    ...SequelizeAttributes.Transaction,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Transaction',
    hooks: {
      beforeSave: async (transaction: Transaction, options) => {
        if (transaction === null || !transaction)
          return;

        if (
          transaction.type !== TRANSACTION_TYPE.TYPE_CHARGE && transaction.type !== TRANSACTION_TYPE.TYPE_MOVE_BONUS && transaction.type !== TRANSACTION_TYPE.TYPE_MOVE_PRIZE &&
          transaction.status === TRANSACTION_STATUS.STATUS_SUCCESS
        ) {
          if (!transaction.idPaymentMethod)
            return;

          let paymentMethod = await Paymentmethod.findByPk(transaction.idPaymentMethod);
          if (paymentMethod === null || !paymentMethod)
            return;

          if (paymentMethod.balance) {
            if (transaction.amountWithSign)
              paymentMethod.balance += transaction.amountWithSign;
          } else {
            if (transaction.amountWithSign)
              paymentMethod.balance = transaction.amountWithSign;
          }
        }
      },
      afterSave: async (transaction: Transaction, options) => {
        // implement bonus on deposit success
        if (transaction.type === TRANSACTION_TYPE.TYPE_ADD && transaction.status === TRANSACTION_STATUS.STATUS_SUCCESS) {
          // Voucher Bonus
          // if (transaction.idVoucherUser) {
          //   const userVoucher = await Voucheruser.findByPk(transaction.idVoucherUser);
          //   if (userVoucher && userVoucher.voucher) {
          //     if (
          //       transaction.amount && userVoucher.voucher.cashThreshold &&
          //       transaction.amount >= userVoucher.voucher.cashThreshold
          //     ) {
          //       let bonusAmount = 0;
          //       let voucherAmount = userVoucher.voucher.amount ? userVoucher.voucher.amount : 0;

          //       if (userVoucher.voucher.moneyType === VOUCHER_MONEY_TYPE.MONEY_TYPE_AMOUNT)
          //         bonusAmount = voucherAmount;
          //       else
          //         bonusAmount = Math.floor(parseFloat(voucherAmount.toString()) / 100.0 * transaction.amount);

          //       const isBonusPay: boolean = (userVoucher.voucher.bonusType === VOUCHER_BONUS_TYPE.BONUS_TYPE_BONUS);
          //       await transaction.addBonus(TRANSACTION_TYPE.TYPE_VOUCHER, TRANSACTION_BONUS.BONUS_TYPE_ADD, transaction.idUser as number, bonusAmount, transaction.id, 0, transaction.idVoucherUser, isBonusPay);
          //     }
          //   }
          // }

          // System Bonus
          const depositBonusAmount = await Setting.findOne({ where: { key: 'general_bonus_deposit_bonus_amount' }});
          const depositBonusRule = await Setting.findOne({ where: { key: 'general_bonus_deposit_rule' }});
          const depositBonusRuleValue = await Setting.findOne({ where: { key: 'general_bonus_deposit_rule_value' }});
          if (
            depositBonusAmount && depositBonusRule && depositBonusRuleValue &&
            depositBonusAmount.value && depositBonusRule.value && depositBonusRuleValue.value
          ) {
            let isAvailable = false;
            const settingAmount = parseInt(depositBonusAmount.value.toString(), 10);
            const settingRule = depositBonusRule.value;
            const settingRuleAmount = parseInt(depositBonusRuleValue.value.toString(), 10);

            if (!isNaN(settingAmount) && settingRule && !isNaN(settingRuleAmount)) {
              if (settingRule === ADMIN_BONUS_SETTING.RULE_ABOVE) {
                if (transaction.amount && transaction.amount >= settingRuleAmount)
                  isAvailable = true;
              } else if (settingRule === ADMIN_BONUS_SETTING.RULE_BELOW) {
                if (transaction.amount && transaction.amount <= settingRuleAmount)
                  isAvailable = true;
              } else if (settingRule === ADMIN_BONUS_SETTING.RULE_EQUAL) {
                if (transaction.amount && transaction.amount === settingRuleAmount)
                  isAvailable = true;
              }
            }

            if (isAvailable) {
              if (settingAmount > 0 && settingAmount <= 100 && transaction.amount) {
                const bonusAmount = Math.floor(parseFloat(settingAmount.toString()) / 100.0 * transaction.amount);

                // await transaction.addBonus(TYPE_SYSTEM, BONUS_TYPE_ADD, loggedInUser.id, bonusAmount, transaction.id, 0, 0, true);
              }
            }
          }

          if (transaction.idUser) {
            // User referral commission

            const user = await User.findByPk(transaction.idUser);
            if (user && user.type === USER_TYPE.TYPE_USER && user.idReferralUser) {
              await transaction.addCommission(
                TRANSACTION_TYPE.TYPE_COMMISSION_REFERRAL, TRANSACTION_BONUS.BONUS_TYPE_ADD, user.idReferralUser,
                transaction.amount as number, user.commissionReferral as number,
                user.id, transaction.id, transaction.idOrder as number);
            }

            // Agent commission
            if (user && transaction.idAgent) {
              const agent = await User.findByPk(transaction.idAgent);
              if (agent) {
                await transaction.addCommission(
                  TRANSACTION_TYPE.TYPE_COMMISSION_AGENT, TRANSACTION_BONUS.BONUS_TYPE_ADD, agent.id,
                  transaction.amount as number, agent.commissionAgent as number,
                  user.id, transaction.id, transaction.idOrder as number);
              }
            }
          }
        }

        // pending ...
        // implement bonus on ticket purchasing success
        /* if (transaction.type === TYPE_CHARGE && transaction.status === STATUS_SUCCESS) {
          // Voucher Bonus
          if (transaction.idVoucherUser) {
            const userVoucher = await Voucheruser.findByPk(transaction.idVoucherUser);            
            if (userVoucher && userVoucher.voucher && transaction.order && transaction.order.idLottery) {
              const isAvailableByLottery = await userVoucher.voucher.getIsAvailableByLottery(transaction.order.idLottery);
              if (isAvailableByLottery) {
                let bonusAmount = 0;
                if (userVoucher.voucher.moneyType === VOUCHER_MONEY_TYPE.MONEY_TYPE_AMOUNT)
                  bonusAmount = userVoucher.voucher.amount ? userVoucher.voucher.amount : 0;
                else if (userVoucher.voucher.amount && transaction.amount)
                  bonusAmount = Math.floor(parseFloat(userVoucher.voucher.amount.toString()) / 100.0 * transaction.amount);

                const isBonusPay = (userVoucher.voucher.bonusType === VOUCHER_BONUS_TYPE.BONUS_TYPE_BONUS);
                let idUser = 0;
                if (transaction.order.buyType === ORDER.BUY_TYPE_AGENT)
                  idUser = transaction.idObjector ? transaction.idObjector : 0;
                else
                  idUser = transaction.idUser ? transaction.idUser : 0;

                  await transaction.addBonus(TYPE_VOUCHER, BONUS_TYPE_CHARGE, idUser, bonusAmount, transaction.id, transaction.idOrder as number, transaction.idVoucherUser, isBonusPay);
              }
            }
          }

          // COMMISSION
          // User referral commission
          let user = null;
          if (transaction.order && transaction.order.buyType === ORDER.BUY_TYPE_AGENT && transaction.idObjector)
            user = await User.findByPk(transaction.idObjector);
          else if (transaction.idUser)
            user = await User.findByPk(transaction.idUser);

          if (user && user.type === USER_TYPE.TYPE_USER && user.idReferralUser) {
            await transaction.addCommission(TYPE_COMMISSION_REFERRAL, BONUS_TYPE_CHARGE, user.idReferralUser, transaction.amount as number,
              user.commissionReferral as number, user.id, transaction.id, transaction.idOrder as number);
          }

          // agent commission
          if (transaction.order && transaction.order.buyType === ORDER.BUY_TYPE_AGENT && transaction.idAgent) {
            const agent = await User.findByPk(transaction.idAgent);
            if (agent && user) {
              await transaction.addCommission(TYPE_COMMISSION_AGENT, BONUS_TYPE_CHARGE, agent.id, transaction.amount as number,
                agent.commissionAgent as number, user.id, transaction.id, transaction.idOrder as number);
            }
          }
        } */

        if (transaction.type === TRANSACTION_TYPE.TYPE_WITHDRAW && transaction.status === TRANSACTION_STATUS.STATUS_SUCCESS && transaction.idUser) {
          // COMMISSION
          // user referral commission
          const user = await User.findByPk(transaction.idUser);
          if (user && user.type === USER_TYPE.TYPE_USER && user.idReferralUser) {
            await transaction.addCommission(TRANSACTION_TYPE.TYPE_COMMISSION_REFERRAL, TRANSACTION_BONUS.BONUS_TYPE_WITHDRAWAL, user.idReferralUser, transaction.amount as number,
              user.commissionReferral as number, user.id, transaction.id, transaction.idOrder as number);
          }

          // agent commission
          if (transaction.idAgent) {
            const agent = await User.findByPk(transaction.idAgent);
            if (agent && user) {
              await transaction.addCommission(TRANSACTION_TYPE.TYPE_COMMISSION_AGENT, TRANSACTION_BONUS.BONUS_TYPE_WITHDRAWAL, agent.id, transaction.amount as number,
                agent.commissionAgent as number, user.id, transaction.id, transaction.idOrder as number);
            }
          }
        }

        if (transaction.type === TRANSACTION_TYPE.TYPE_PRIZE && transaction.status === TRANSACTION_STATUS.STATUS_SUCCESS && transaction.idUser) {
          // COMMISSION
          // user referral commission
          const user = await User.findByPk(transaction.idUser);
          if (user && user.type === USER_TYPE.TYPE_USER && user.idReferralUser) {
            await transaction.addCommission(TRANSACTION_TYPE.TYPE_COMMISSION_REFERRAL, TRANSACTION_BONUS.BONUS_TYPE_PRIZE, user.idReferralUser, transaction.amount as number,
              user.commissionReferral as number, user.id, transaction.id, transaction.idOrder as number);
          }

          // agent commission
          if (transaction.idAgent) {
            const agent = await User.findByPk(transaction.idAgent);
            if (agent && user) {
              await transaction.addCommission(TRANSACTION_TYPE.TYPE_COMMISSION_AGENT, TRANSACTION_BONUS.BONUS_TYPE_PRIZE, agent.id, transaction.amount as number,
                agent.commissionAgent as number, user.id, transaction.id, transaction.idOrder as number);
            }            
          }
        }

        if (transaction.type === TRANSACTION_TYPE.TYPE_DEPOSIT_AGENT_USER && transaction.status === TRANSACTION_STATUS.STATUS_SUCCESS) {
          // System Bonus
          const depositBonusAmount = await Setting.findOne({ where: { key: 'general_bonus_deposit_bonus_amount' } });
          const depositBonusRule = await Setting.findOne({ where: { key: 'general_bonus_deposit_rule' } });
          const depositBonusRuleValue = await Setting.findOne({ where: { key: 'general_bonus_deposit_rule_value' } });

          if (
            depositBonusAmount && depositBonusRule && depositBonusRuleValue &&
            depositBonusAmount.value && depositBonusRule.value && depositBonusRuleValue.value
          ) {
            let isAvailable = false;
            const settingAmount = parseInt(depositBonusAmount.value.toString(), 10);
            const settingRule = depositBonusRule.value;
            const settingRuleAmount = parseInt(depositBonusRuleValue.value.toString(), 10);

            if (
              settingAmount && !isNaN(settingAmount) &&
              settingRule &&
              settingRuleAmount && !isNaN(settingRuleAmount)
            ) {
              if (settingRule === ADMIN_BONUS_SETTING.RULE_ABOVE) {
                if (transaction.amount && transaction.amount >= settingRuleAmount)
                  isAvailable = true;
              } else if (settingRule === ADMIN_BONUS_SETTING.RULE_BELOW) {
                if (transaction.amount && transaction.amount <= settingRuleAmount)
                  isAvailable = true;
              } else if (settingRule === ADMIN_BONUS_SETTING.RULE_EQUAL) {
                if (transaction.amount && transaction.amount === settingRuleAmount)
                  isAvailable = true;
              }
            }

            if (isAvailable && transaction.amount && transaction.idUser) {
              if (settingAmount && settingAmount <= 100) {
                const bonusAmount = Math.floor(parseFloat(settingAmount.toString()) / 100.0 * transaction.amount);
                await transaction.addBonus(TRANSACTION_TYPE.TYPE_SYSTEM, TRANSACTION_BONUS.BONUS_TYPE_ADD, transaction.idUser, bonusAmount, transaction.id, 0, 0, true);
              }
            }
          }

          // COMMISSION
          // user referral commission
          if (transaction.idUser) {
            const user = await User.findByPk(transaction.idUser);
            if (user && user.type === USER_TYPE.TYPE_USER && user.idReferralUser) {
              await transaction.addCommission(TRANSACTION_TYPE.TYPE_COMMISSION_REFERRAL, TRANSACTION_BONUS.BONUS_TYPE_ADD, user.idReferralUser, transaction.amount as number,
                user.commissionReferral as number, user.id, transaction.id, transaction.idOrder as number);
            }

            if (transaction.idAgent) {
              const agent = await User.findByPk(transaction.idAgent);
              if (agent && user) {
                await transaction.addCommission(TRANSACTION_TYPE.TYPE_COMMISSION_AGENT, TRANSACTION_BONUS.BONUS_TYPE_ADD, agent.id, transaction.amount as number,
                  agent.commissionAgent as number, user.id, transaction.id, transaction.idOrder as number);
              }
            }
          }
        }

        // send email upon withdrawal success
        if (transaction.type === TRANSACTION_TYPE.TYPE_WITHDRAW && transaction.status === TRANSACTION_STATUS.STATUS_SUCCESS) {
          // pending ...
        }
      },
    },
  }
);

// Transaction.hasOne(Ticket, {
//   sourceKey: 'id',
//   foreignKey: 'idTransaction',
//   as: 'ticket',
// });

// Ticket.belongsTo(Transaction, {
//   targetKey: 'id',
//   foreignKey: 'idTransaction',
//   as: 'transaction',
// });

Transaction.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idRef',
  as: 'transactions',
});

export default Transaction;
