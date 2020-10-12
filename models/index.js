const sequelize = require('../dataBase/configDataBase');

const models = {
  user: require('./user'),
  carteira: require('./carteira'),
  sequelize: sequelize
}

module.exports = models
