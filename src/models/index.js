const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter(
    file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// relationships for models

//= ==============================
// Define all relationships here below
//= ==============================
db.CreditCard.belongsTo(db.Children, {
  as: 'holder',
  foreignKey: 'cardHolder',
});
db.Children.hasMany(db.CreditCard, { as: 'creditCards', foreignKey: 'cardHolder' });
db.Transaction.belongsTo(db.CreditCard, { as: 'card', foreignKey: 'cardId' });
db.CreditCard.hasMany(db.Transaction, {
  as: 'transactions',
  foreignKey: 'cardId',
});
db.Children.belongsTo(db.User, { as: 'parent', foreignKey: 'parentId' });
db.User.hasMany(db.Children, { as: 'children', foreignKey: 'parentId' });

module.exports = db;
