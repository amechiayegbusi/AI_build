// *** STATUS ***
export const TRANSACTION_STATUS = {  
  STATUS_SUCCESS: 'success',
  STATUS_PENDING: 'pending',
  STATUS_NOMONEY: 'nomoney',
  STATUS_DECLINED: 'declined',
};

// *** TYPE ***
export const TRANSACTION_TYPE = {
  TYPE_ADD: 'add',
  TYPE_WITHDRAW: 'withdraw',
  TYPE_REVERSAL: 'reversal',

  TYPE_CHARGE: 'charge',
  TYPE_PRIZE: 'prize',
  TYPE_REFUND: 'refund',

  TYPE_MOVE_BONUS: 'move',
  TYPE_MOVE_PRIZE: 'move_prize',

  TYPE_DEPOSIT_AGENT_USER: 'send_deposit_user',

  TYPE_COMMISSION_REFERRAL: 'commission_referral',
  TYPE_COMMISSION_AGENT: 'commission_agent',

  TYPE_SYSTEM: 'system',
  TYPE_VOUCHER: 'voucher',
};

// *** BONUS TYPE ***
export const TRANSACTION_BONUS = {
  BONUS_TYPE_REGISTER: 'bonus_register',
  BONUS_TYPE_CHARGE: 'bonus_charge',
  BONUS_TYPE_ADD: 'bonus_add',
  BONUS_TYPE_WITHDRAWAL: 'bonus_withdrawal',
  BONUS_TYPE_PRIZE: 'bonus_prize',
};

// *** AGGREGATE TYPE ***
export const TRANSACTION_AGGREGATE = {
  AGGREGATE_TYPE_DEPOSIT: 'deposit',
  AGGREGATE_TYPE_WITHDRAW: 'withdrawal',
  AGGREGATE_TYPE_REFUND: 'refund',
};
