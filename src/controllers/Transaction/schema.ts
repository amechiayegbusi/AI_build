import * as Joi from 'joi';

const create = Joi
  .object({
    name: Joi.string().min(0).max(100).required(),
    lname: Joi.string().min(0).max(100).required(),    
    country: Joi.string().min(0).max(255).required(),
    countryCode: Joi.string().min(0).max(20).required(),
    phone: Joi.string().min(0).max(30).required(),
    fromWhere: Joi.number().min(0).max(3).required(),
    verificationType: Joi.string().min(0).max(20).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(0).max(255).required(),
    password: Joi.string().min(0).max(255).required()
  });

export default { create };
