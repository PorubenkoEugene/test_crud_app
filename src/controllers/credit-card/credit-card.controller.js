import crypto from 'crypto';
import sequelize from '../../config/sequelize';
import { CreditCard, Children, Transaction } from '../../models';

import { successResponse, errorResponse } from '../../helpers';
import GetCurrentMonthTotalExpensesByCard from '../../helpers/getCurrentMonthTotalExpensesByCard';

export const getCreditCard = async (req, res) => {
  try {
    const creditCard = await CreditCard.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Children,
          as: 'holder',
        },
      ],
      attributes: {
        exclude: ['expDate', 'securityCode'],
      },
    });

    return successResponse(req, res, { creditCard });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const addCreditCard = async (req, res) => {
  try {
    const creditCard = await CreditCard.findOne({ where: { number: req.body.number } });
    if (creditCard) {
      throw new Error('Credit card already exists');
    }

    const cardHolder = await Children.findOne({
      where: {
        id: req.body.cardHolder,
      },
    });
    if (!cardHolder) {
      throw new Error('Card holder not exists');
    }

    const { securityCode, ...body } = req.body;

    const hashedCode = crypto
      .createHash('sha256')
      .update(req.body.securityCode)
      .digest('hex');

    const newCreditCard = await CreditCard.create({ securityCode: hashedCode, ...body });

    return successResponse(req, res, { });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const updateCreditCardLimit = async (req, res) => {
  try {
    const creditCard = await CreditCard.findOne({ where: { id: req.params.id } });
    if (!creditCard) {
      throw new Error('Credit card not found');
    }

    const updatedCreditCard = await creditCard.update({ ...req.body });

    return successResponse(req, res, { });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const deleteCreditCard = async (req, res) => {
  try {
    const creditCard = await CreditCard.findOne({ where: { id: req.params.id } });
    if (!creditCard) {
      throw new Error('Credit card not found');
    }

    const deletedCreditCard = await creditCard.destroy();

    return successResponse(req, res, { });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const addCharge = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { number, securityCode, sum } = req.body;

    const creditCard = await CreditCard.findOne({ where: { number } });
    if (!creditCard) {
      throw new Error('Credit card not found');
    }

    const {
      id, limit, balance, securityCode: creditCardSecurityCode,
    } = creditCard;

    const hashedCode = crypto
      .createHash('sha256')
      .update(securityCode)
      .digest('hex');

    if (hashedCode !== creditCardSecurityCode) {
      throw new Error('Incorrect security code');
    }

    if (balance < sum) {
      throw new Error('There are not enough funds on the card');
    }

    const currentMonthTotalExpensesByCard = await GetCurrentMonthTotalExpensesByCard(id);

    if (currentMonthTotalExpensesByCard + sum > limit) {
      throw new Error('Card limit exceeded');
    }

    const cardBalance = balance - sum;
    const creditCardUpdated = await creditCard.update({ balance: cardBalance }, { transaction: t });

    const transactionCreated = await Transaction.create(
      {
        cardId: id,
        sum,
      },
      { transaction: t },
    );

    await t.commit();

    return successResponse(req, res, { });
  } catch (error) {
    await t.rollback();
    return errorResponse(req, res, error.message);
  }
};
