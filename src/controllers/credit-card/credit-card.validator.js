const Joi = require('joi');

export const addCreditCard = {
  body: {
    type: Joi.string().required(),
    number: Joi.string().min(16).max(16).required(),
    expDate: Joi.date().required(),
    securityCode: Joi.string().min(4).max(4).required(),
    limit: Joi.number().required(),
    cardHolder: Joi.number().required(),
    balance: Joi.number().required(),
  },
};

export const updateCreditCardLimit = {
  body: {
    limit: Joi.number().required(),
  },
};

export const addCharge = {
  body: {
    number: Joi.string().min(16).max(16).required(),
    expDate: Joi.date().required(),
    securityCode: Joi.string().min(4).max(4).required(),
    sum: Joi.number().required(),
  },
};
