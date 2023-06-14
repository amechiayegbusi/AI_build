export interface LoginFormAttributes {
  email: string;
  password: string;
  loginType: number;
  idUser?: number;
};

export interface EmailAttributes {
  email: string;
  name: string;
  lname: string;
};

export interface UserAttributes {
  email: string;
  name: string;
  lname: string;
};

export interface verifyRefreshTokenAttributes {
  id: number;
  name: string;
  lname: string;
  email: string;
  status: number;
  authKey: string;
};

export interface RefreshTokenAttributes {
  id?: number;
  userId: number;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface SessionAttributes {
  id?: number;
  userId: number;
  token: string;
  ipAddress?: string | null;
  device?: string | null;
  platform?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export interface PasswordResetEmailTemplateAttributes {
  email: string;
  name: string;
  lname: string;
};

export interface SmsVerifySendAttributes {
  phone: string;
  checkUnique: boolean;
};

export interface SmsVerifyConfirmAttributes {
  phone: string;
  code: string;
};

export interface VipAttributes {
  id: number;
  name?: string;
  type?: number;
  comboCount?: number;
  ticketCount?: number;
  drawsCount?: number;
  discount?: number;
  logoImgUrl?: string;
  status?: number;
  jackpot?: number;
  price?: number;
};

export interface VoucherAttributes {
  id: number;
  code?: string;
  amount?: number;
  whereType?: number;
  moneyType?: number;
  bonusType?: number;
  count?: number;
  usageCount?: number;
  hasLottery?: number;
  cashThreshold?: number;
  startDate?: Date;
  endDate?: Date;
  title?: string;
  description?: string;
  enabled?: number;
  redeemStatus?: number;
};

export interface ApplyVoucherReqAttributes {
  code: string;
  whereType: number;
};

export interface ApplyVoucherResAttributes {
  status: string;
  message: string;
  idVoucherUser?: number;
  voucher?: VoucherAttributes;
};

export interface WithdrawalReqAttributes {
  amount: number;
  accountName: string;
  accountNumber: number;
  bankName: string;
  idAgent?: number;
  idTerminal?: number;
};

export interface WithdrawalResAttributes {
  success?: boolean;
};
