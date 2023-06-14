import * as Joi from 'joi';

const create = Joi.object({
  userId: Joi.number().min(1).required(),
  token: Joi.string().min(0).required(),
});

export default { create };
