const sequelize = require('../dataBase/configDataBase');


const models = {
  carteira: require('./carteira'),
  sequelize: sequelize
}

module.exports = models


models.carteira.sync({force: true})