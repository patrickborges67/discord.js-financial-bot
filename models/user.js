const Sequelize = require('sequelize');
const sequelize = require('../dataBase/configDataBase.js');

const User = sequelize.define('users', {
    discord_ID: {
        type: Sequelize.BIGINT, 
        allowNull: false,
        primaryKey: true        
    },
    nome: {
        type: Sequelize.STRING
    },
});
module.exports = User;
