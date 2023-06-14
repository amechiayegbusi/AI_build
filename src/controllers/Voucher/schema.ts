import * as Joi from 'joi';

const apply = Joi.object({
  code: Joi.string().min(1).max(255).required(),
  whereType: Joi.number().min(1).max(2).required(),
});

export default { apply };
