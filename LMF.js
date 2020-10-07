const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const api = require('./apiCall.js');



bot.login(config.token);


bot.on('ready', ()=> {
    console.log('pronto');
    bot.user.setActivity('Estudando')

    var testChannel = bot.channels.cache.find(channel => channel.id === config.bemVindoLobos)
    setInterval(() => {
        testChannel.send(" estou pronto ");
    }, 1000 * 60 * 60 * 3);
})

bot.on('message', async message => {
    if(message.author.bot) return;
   
    const CompleteMessage = message.content.toUpperCase();
    if(CompleteMessage.indexOf(config.prefix) !== 0) return;

    let args = message.content.toLowerCase().split(" ");
    var author = message.author;
    var id = author.id;
    switch (args[1]) {

        case (!args[1]):
            message.channel.send("Para acessar a lista de comandos digite !BULL help");
            break;

        case 'help':
            message.channel.send(
                "comprar\nvender\ncarteira\nsaldo")
            break;

        // case 'ping':
        //     const ms = await message.channel.send("ping?");
        //     const clientms = ms.createdTimestamp - message.createdTimestamp;
        //     ms.edit('pong! Client ' + clientms);
        //     break;

        case 'comprar'://!LMF comprar PETR4 3
                message.channel.send('Parabens, você comprou 2 lotes de PETR4 e seu saldo agora é...');
                if(!args[2]){// Se não for informado o nome do ativo
                    message.channel.send('Por favor, informe qual ativo você quer comprar.');
                } else {
                    //let ativo = ... buscar no BD e/ou API o ativo em questão
                    if(ativo == null){
                        message.channel.send('Este ativo não foi encontrado. Use !LMF search "nome do ativo" para procurar a nomenclatura.');
                    } else if(!args[3]){// Se não for informado a quantidade para compra
                        message.channel.send('Por favor, informe a quantidade de lotes que deseja comprar.');
                    } else {
                        //let saldo = buscar o saldo do usuário no BD
                        //saldo -= (ativo*args[2]);
                        //let carteira = buscar carteira do usuário no BD
                        //carteira = ... Se o usuário já tiver esse ativo somar os lotes, se não adicionar a carteira
                        message.channel.send('Parabéns, você comprou '+args[3] + 'lotes de '+args[2]+' e seu saldo agora é '+saldo);
                    }
                }
            break; 
        case 'vender':
            if(!args[2]){// Se não for informado o nome do ativo
                message.channel.send('Por favor, informe qual ativo você quer vender.');
            } else {
                //let ativo = ... buscar no BD e/ou API o ativo em questão
                if(ativo == null){
                    message.channel.send('Este ativo não foi encontrado. Use !LMF search "nome do ativo" para procurar a nomenclatura.');

              //  } else if{//Se não tiver o ativo na carteira...
                    //message.channel.send('${author}, você não tem ativos suficientes para essa venda.');
                } else if(!args[3]){// Se não for informado a quantidade para venda
                    message.channel.send('Por favor, informe a quantidade de lotes que deseja vender.');
                } else {
                    //let quantidadeCarteira = buscar a quantidade de ativos que o usuario escolheu pra venda
                    if(quantidadeCarteira >= args[3]){

                    } else{
                        message.channel.send('você não tem ativos suficientes para essa venda')
                    }
                    //let saldo = buscar o saldo do usuário no BD
                    //saldo = 
                    
                    //carteira = ... Se o usuário já tiver esse ativo somar os lotes, se não adicionar a carteira
                    message.channel.send('Parabéns, você vendeu '+args[3] + 'lotes de '+args[2]+' e seu saldo agora é '+saldo);
                }
            }
                message.channel.send('Parabens, você vendeu 2 lotes de PETR4, lucrou 3,7% e seu saldo agora é...');
            break; 
        case 'carteira':
                let carteira = null;
                //carteira = ... Busca pela carteira do usuário através do ID
                if(carteira == null){
                    // Cria carteira e cadastro do usuário através do ID
                    message.channel.send('Parabéns, sua carteira foi criada!');
                } else{
                    message.channel.send( `${author} Sua carteira é composta por: `);
                    //Busca e imprime a carteira do usuário
                }
                
            break; 
        case 'saldo':
                
                message.channel.send( `${author} Seu saldo atual é de...`);
            break; 

        case 'teste':
                
                var time = new Date();
                api.apiGet(args[2])
                .then(fechamento =>{
                     message.channel.send(fechamento);
                }).catch(err=>{
                    console.log(err);
                });
                
                const msg =  message.channel.send( `${author} validando os dados `);
                
                var now = new Date();
                timeMain = now.getMilliseconds() - time.getMilliseconds();
                console.log('tempo pra mensagem ser enviada: '+ timeMain);
                //console.log('Main fechamento: '+ fechamento);
                
                
            break; 

        default:
            message.channel.send("Para acessar a lista de comandos digite !LMF help");
            break;
        
    }
});