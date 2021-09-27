import { Sequelize } from 'sequelize';
import { Transaction } from '../models';


export default async (cardId) => {
  const [{ total }] = await Transaction.findAll({
    where: {
      cardId,
      date: Sequelize.literal('MONTH(date) = MONTH(CURRENT_DATE())'),
    },
    raw: true,
    attributes: [
      [Sequelize.literal('SUM(sum)'), 'total'],
    ],
  });

  return total;
}
