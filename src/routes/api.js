import express from 'express';
import validate from 'express-validation';

import * as userController from '../controllers/user/user.controller';
import * as childrenController from '../controllers/children/children.controller';
import * as creditCardController from '../controllers/credit-card/credit-card.controller';
import * as userValidator from '../controllers/user/user.validator';
import * as childrenValidator from '../controllers/children/children.validator';
import * as creditCardValidator from '../controllers/credit-card/credit-card.validator';

const router = express.Router();

//= ===============================
// API routes
//= ===============================
router.get('/me', userController.profile);
router.post(
  '/changePassword',
  validate(userValidator.changePassword),
  userController.changePassword,
);

router.get('/children/list', childrenController.getChildrenList);
router.get('/children/:id', childrenController.getChildren);
router.post('/children', validate(childrenValidator.addChildren), childrenController.addChildren);
router.patch('/children/:id', childrenController.updateChildren);
router.delete('/children/:id', childrenController.deleteChildren);

router.get('/credit-card/:id', creditCardController.getCreditCard);
router.post('/credit-card', validate(creditCardValidator.addCreditCard), creditCardController.addCreditCard);
router.patch('/credit-card/limit/:id', validate(creditCardValidator.updateCreditCardLimit), creditCardController.updateCreditCardLimit);
router.delete('/credit-card/:id', creditCardController.deleteCreditCard);
router.post('/credit-card/charge', validate(creditCardValidator.addCharge), creditCardController.addCharge);

module.exports = router;
