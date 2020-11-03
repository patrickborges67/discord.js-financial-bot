const Sequelize = require('sequelize');
const sequelize = require('../dataBase/herokuPG.js');

const Carteira = sequelize.define('carteiras', {
    discord_ID:{ 
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true     
    },
    nome: {
        type: Sequelize.STRING
    },
    saldo: {
        type: Sequelize.FLOAT
    },
    ativos: {
        type: Sequelize.TEXT
    }
});
module.exports = Carteira;


