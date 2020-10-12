const Sequelize = require('sequelize');
const sequelize = require('../dataBase/configDataBase.js');

const Carteira = sequelize.define('carteiras', {
    carteira_ID:{ 
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true     
    },
    saldo: {
        type: Sequelize.FLOAT
    },
    ativos: {
        type: Sequelize.TEXT
    }
});
module.exports = Carteira;


