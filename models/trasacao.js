const Sequelize = require('sequelize');
const sequelize = require('../dataBase/configDataBase.js');

const Transacao = sequelize.define('transacoe', {
    discord_ID:{ 
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true     
    },
    tipo: {
        type: Sequelize.STRING
    },
    valorTransacao: {
        type: Sequelize.FLOAT
    },
    ativo: {
        type: Sequelize.TEXT
    }
});
module.exports = Transacao;


