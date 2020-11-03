const Sequelize = require('sequelize');




if(process.env.DATABASE_URL){
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect:  'postgres',
        protocol: 'postgres',
        port:     match[4],
        host:     match[3],
        logging:  true 
      })

} else {
    const sequelize = new Sequelize({
        host: 'localhost',
        database: 'postgres',
        username: 'postgres',
        password: 'postgres',
        dialect: 'postgres',
        port: 5432,
        logging: true
    });
}


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