import express from 'express';

const router = express.Router();

export default router;

require('controllers/Auth/controller');
require('controllers/User/controller');
require('controllers/Vip/controller');
require('controllers/Voucher/controller');
require('controllers/Withdrawal/controller');
