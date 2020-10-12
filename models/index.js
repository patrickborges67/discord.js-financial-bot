const sequelize = require('../dataBase/configDataBase');

const models = {
  user: require('./user'),
  carteira: require('./carteira'),
  sequelize: sequelize
}

module.exports = models

// models.user.sync({force: true})
// models.carteira.sync({force: true})