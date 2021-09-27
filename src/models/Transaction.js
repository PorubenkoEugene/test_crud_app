export default function (sequelize, DataTypes) {
  return sequelize.define('Transaction', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CreditCard',
        key: 'id',
      },
    },
    sum: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: true,
    },
  }, {
    tableName: 'Transactions',
  });
}
