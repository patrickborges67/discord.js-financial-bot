const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function dataBaseTestHero(){

    try{
        let result = await client.connect();
        console.log("Sequelize realizou a conexão com o banco de dados com sucesso");
    }
    catch(error){
        console.error("Houve um erro ao se conectar com o banco de dados: ")
        console.error(error);
        process.exit();
    }
}


client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

module.exports = client;



dataBaseTestHero();