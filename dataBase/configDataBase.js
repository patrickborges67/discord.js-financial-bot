var Sequelize = require('sequelize'), sequelize = null;
const pg = require('pg');
var heroku = process.env.DATABASE_URL;




// if(process.env.DATABASE_URL){
//     const sequelize = new Sequelize(process.env.DATABASE_URL, {
//         dialect:  'postgres',
//         protocol: 'postgres',
//         port:     match[4],
//         host:     '5432',
//         logging:  true 
//       })

// } else {
    // const sequelize = new Sequelize({
    //     host: 'localhost',
    //     database: 'postgres',
    //     username: 'postgres',
    //     password: 'postgres',
    //     dialect: 'postgres',
    //     port: 5432,
    //     logging: true
    // });
// }

// sequelize = new Sequelize({
//     host: 'localhost',
//     database: 'postgres',
//     username: 'postgres',
//     password: 'postgres',
//     dialect: 'postgres',
//     port: 5432,
//     logging: true
// });
console.log(heroku);
if(heroku){
    sequelize = new Sequelize(heroku, {
        dialect:  'postgres',
        protocol: 'postgres',
        logging:  true 
    });
    console.log('heroku')
} else {
    sequelize = new Sequelize({
        host: 'localhost',
        database: 'postgres',
        username: 'postgres',
        password: 'postgres',
        dialect: 'postgres',
        port: 5432,
        logging: true
    });
    console.log('localBD')
}



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
module.exports = sequelize