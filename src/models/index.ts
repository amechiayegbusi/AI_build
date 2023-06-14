import User from './user'
import Cart from './cart';
import Country from './country';
import Currency from './currency';
import Draw from './draw';
import EmailVerify from './emailverify';
import GroupLottery from './grouplottery';
import GroupUser from './groupuser';
import Language from './language';
import Lottery from './lottery';
import Pastdraw from './pastdraw'
import Pastdrawmatch from './pastdrawmatch'
import Paymentmethod from './paymentmethod'
import Paymentmethodconfig from './paymentmethodconfig'
import Permission from './permission'
import PermissionRole from './permissionrole'
import PersonalAccessToken from './personalaccesstoken'
import Playwin from './playwin'
import Playwinsetting from './playwinsetting'
import Role from './role'
import SmsVerify from './smsverify'
import Terminal from './terminal'
import Ticket from './ticket'
import Timezone from './timezone'
import Transaction from './transaction'
import UnreadManagerToUserMessage from './unreadmanagertousermessage'
import UnreadUserToManagerMessage from './unreadusertomanagermessage'
import Vip from './vip'
import Vipcombo from './vipcombo'
import Voucher from './voucher'
import Voucherlottery from './voucherlottery'
import Voucheruser from './voucheruser'
import WebsocketsStatisticsEntry from './websocketstatisticsentry'
import Withdrawal from './withdrawal'

const models = {
  Pastdraw,
  Pastdrawmatch,
  Paymentmethod,
  Paymentmethodconfig,
  Permission,
  PermissionRole,
  PersonalAccessToken,
  Playwin,
  Playwinsetting,
  Role,
  SmsVerify,
  Terminal,
  Ticket,
  Timezone,
  Transaction,
  UnreadManagerToUserMessage,
  UnreadUserToManagerMessage,
  User,
  Cart,
  Country,
  Currency,
  Draw,
  EmailVerify,
  GroupLottery,
  GroupUser,
  Language,
  Lottery,
  Vip,
  Vipcombo,
  Voucher,
  Voucherlottery,
  Voucheruser,
  WebsocketsStatisticsEntry,
  Withdrawal,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  /* if (model?.associate) {
    model.associate(models)
  } */
  return model
})
