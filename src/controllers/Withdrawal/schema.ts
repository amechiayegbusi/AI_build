import * as Joi from 'joi';

const request = Joi.object({
  amount: Joi.number().min(1).required(),
  accountName: Joi.string().required(),
  accountNumber: Joi.number().required(),
  bankName: Joi.string().required(),
});

export default { request };
