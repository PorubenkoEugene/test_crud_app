export default function (sequelize, DataTypes) {
  return sequelize.define('CreditCard', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    cardHolder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Children',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: 'number',
    },
    expDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    securityCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    limit: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: true,
    },
    balance: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: true,
    },
  }, {
    tableName: 'CreditCards'
  });
};
