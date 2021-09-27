const Joi = require('joi');

export const addChildren = {
  body: {
    name: Joi.string().required(),
    birthDate: Joi.date().required(),
  },
};
