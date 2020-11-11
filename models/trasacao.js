const Sequelize = require('sequelize');
const sequelize = require('../dataBase/configDataBase.js');

const Transacao = sequelize.define('transacoe', {
    discord_ID:{ 
        type: Sequelize.BIGINT,
        allowNull: false,   
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valorTransacao: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    ativo: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});
module.exports = Transacao;


