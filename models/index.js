const sequelize = require('../dataBase/configDataBase');


const models = {
  carteira: require('./carteira'),
  transacao: require('./trasacao'),
  sequelize: sequelize
}

module.exports = models


models.carteira.sync({force: true})
models.transacao.sync({force: true})