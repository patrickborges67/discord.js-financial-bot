const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'localhost',
    database: 'FinanceiroTeste',
    username: 'postgres',
    password: '92424413',
    dialect: 'postgres',
    port: 5432,
    logging: true
});

module.exports = sequelize

//Testar a conexão do BD

async function dataBaseTest(){

    try{
        let result = await sequelize.authenticate();
        console.log("Sequelize realizou a conexão com o banco de dados com sucesso");
    }
    catch(error){
        console.error("Houve um erro ao se conectar com o banco de dados: ")
        console.error(error);
        process.exit();
    }
}

dataBaseTest();