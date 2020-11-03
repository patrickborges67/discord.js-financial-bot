const sequelize = require('../dataBase/configDataBase');
const heroku = require('../dataBase/herokuPG');

const models = {
  carteira: require('./carteira'),
  sequelize: heroku
}

module.exports = models


//models.carteira.sync({force: true})