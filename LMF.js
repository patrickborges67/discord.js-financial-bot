const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NzAxMjI1MTU5NTE5ODk1NjMz.XpuY0g.14ZcGT03hlYkVgh_Aa2Dx8wok3Y';
const api = require('./rest/apiCall.js');
const models = require('./models/index');
const prefix = process.env.DISCORD_PREFIX;



bot.login(token);


bot.on('ready', ()=> {
    console.log('pronto');
    bot.user.setActivity('Estudando')

    // var testChannel = bot.channels.cache.find(channel => channel.id === config.bemVindoLobos)
    // setInterval(() => {
    //     testChannel.send(" estou pronto ");//mensagem enviada a cada 3h
    // }, 1000 * 60 * 60 * 3);
})

bot.on('message', async message => {
    if(message.author.bot) return;
   
    const CompleteMessage = message.content.toUpperCase();
    if(CompleteMessage.indexOf('!'+prefix) !== 0) return;

    let realMessage = message.content.split(" ");
    let args = message.content.toLowerCase().split(" ");
    var author = message.author;
    var id = author.id;
    let carteira = null;
    switch (args[1]) {

        case (!args[1]):
            message.channel.send("Para acessar a lista de comandos digite !LMF help");
            break;

        case 'help':
            message.channel.send(
                "comprar\nvender\ncarteira\nsaldo")
            break;

        case 'comprar'://!LMF comprar PETR4 3
                
                if(!args[2]){// Se não for informado o nome do ativo
                    message.channel.send('Por favor, informe qual ativo você quer comprar.');

                } else if(!args[3]){// Se não for informado a quantidade para compra
                    message.channel.send('Por favor, informe a quantidade de lotes que deseja comprar. Exemplo: !LMF comprar PETR4.sao 3');
                    break;
                } else {
                    message.channel.send( `${author} validando os dados...`);
                    let fechamento = api(args[2]);
                    if(fechamento == null){//Se o ativo não for encontrado no request da API
                       message.channel.send('Este ativo não foi encontrado. Use o nome do ativo + .SAO. Exemplo: PETR4.SAO');
                       break;
                    } else {//Busca no BD o usuário
                        valorCompra = args[3] * 100 * fechamento
                        carteira =  models.carteira.findAll({
                            where: {
                           discord_ID: id
                           },
                           raw: true,
                           plain: true
                       });
                       carteira.then(cart => {
                            var saldo = JSON.parse(JSON.stringify(cart));
                           
                           
                            if(saldo == null || saldo.saldo < valorCompra){
                               
                                message.channel.send(`${author}, você não tem saldo suficiente para essa compra.`);
                                
                            } else {
                               
                                if(saldo.ativos == null){//Se não tiver nenhum ativo na conta, efetuar a compra
                                    // const t = sequelize.transaction();
                                    var ativo = new String(realMessage[2].toUpperCase()).substring(0,5);
                                    var ativos = ativo + '='+args[3]+'/'; 
                                    var saldoNovo = saldo.saldo-valorCompra;
                                    try {
                                    var compra = models.carteira.update({ativos: `${ativos}`}, {
                                        where: {
                                            discord_ID: id
                                        }
                                    });
                                    message.channel.send('Parabéns, você comprou '+args[3] + 'lotes de '+args[2]+' e seu saldo agora é '+saldoNovo);
                                        
                                     } catch (error) {
                                         console.log(error)
                                         //t.rollback();
                                     }
                            

                                } else{// verificar se ja existe esse ativo
                                    var ativo = new String(realMessage[2].toUpperCase()).substring(0,5);
                                    var ativos = saldo.ativos
                                    ativos = ativos.split("/");
                                    ativos = ativos.split("=");
                                    var map = new Map();
                                    
                                    for(var i=0;i<ativos.length;i+2){
                                        map.set(ativos[i], ativos[i+1])
                                    }
                                    if(map.has(ativo)){
                                        var quantidadeNova = map.get(ativo)+args[3];
                                        map.delete(ativo);
                                        map.set(ativo, quantidadeNova);
                                        ativos = null;
                                        map.forEach((value,key)=>{
                                            ativos += key+'='+value+'/'
                                        })
                                        try {
                                            var compra = models.carteira.update({ativos: `${ativos}`}, {
                                                where: {
                                                    discord_ID: id
                                                }
                                            });
                                            message.channel.send('Parabéns, você comprou '+args[3] + 'lotes de '+ativo+' e seu saldo agora é '+saldoNovo);
                                                
                                        } catch (error) {
                                            console.log(error)
                                            //t.rollback();
                                        }
                                    } else {
                                        var ativos = saldo.ativos;
                                        try {
                                            var compra = models.carteira.update({ativos: `${ativos}`}, {
                                                where: {
                                                    discord_ID: id
                                                }
                                            });
                                            message.channel.send('Parabéns, você comprou '+args[3] + 'lotes de '+ativo+' e seu saldo agora é '+saldoNovo);
                                                
                                        } catch (error) {
                                            console.log(error)
                                            //t.rollback();
                                        }
                                    }
                                }

                            }
                       });
                        // var ativo = new String(realMessage[2].toUpperCase()).substring(0,5);                   
                        // var valorTotal = fechamento * args[3];

                        // fechamento = fechamento.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                        // valorTotal = valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

                        // message.channel.send(`${author} parabéns, você comprou ${realMessage[3]} lotes de ${ativo} a ${fechamento} e utilizou o total de ${valorTotal} do seu saldo.`);
                        // break; 
                        
                        //message.channel.send('Parabéns, você comprou '+args[3] + 'lotes de '+args[2]+' e seu saldo agora é '+saldo.saldo);
                    }
                }
            break; 
        case 'vender'://!LMF comprar PETR4 3
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
                carteira =  models.carteira.findAll({
                     where: {
                    discord_ID: id
                    },
                    raw: true,
                    plain: true
                });
                carteira.then(cart => {
                    var saldo = JSON.parse(JSON.stringify(cart));
                    
                    if(saldo == null){
                        models.carteira.create({
                            discord_ID: id,
                            nome: author.username,
                            saldo: 100000,
                        })
                        message.channel.send('Parabéns, sua carteira foi criada!');
                    } else {
                        if(saldo.ativos == null){
                            var f = saldo.saldo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                            message.channel.send( `${author} Seu saldo atual é: ${f}`);
                            message.channel.send( `E Sua carteira está vazia.`);

                        } else {
                            var f = saldo.saldo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                            message.channel.send( `${author} Seu saldo atual é: ${f}`);
                            message.channel.send( `E Sua carteira é composta pelos seguintes ativos: ${saldo.ativos}`);
                        }
                    }
                });
                
            break; 
        case 'saldo':
            carteira =  models.carteira.findAll({
                 where: {
                discord_ID: id
                },
                raw: true,
                plain: true
            });
            carteira.then(cart => {
                var saldo = JSON.parse(JSON.stringify(cart));
                var f = saldo.saldo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                message.channel.send( `${author} Seu saldo atual é de ${f}`);
            });
            break; 

        case 'teste'://Testando a o HTTP request na API 
                message.channel.send( `${author} validando os dados...`);
                
                let fechamento = api(args[2]);
                if(fechamento == null){
                    message.channel.send('Este ativo não foi encontrado. Use o nome do ativo + .SAO. Exemplo: PETR4.SAO');
                    break;
                } else{
                    var ativo = new String(realMessage[2].toUpperCase()).substring(0,5);                   
                    var valorTotal = fechamento * args[3]*100;

                    fechamento = fechamento.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                    valorTotal = valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

                    message.channel.send(`${author} parabéns, você comprou ${realMessage[3]} lotes de ${ativo} a ${fechamento} e utilizou o total de ${valorTotal} do seu saldo.`);
                    break; 
                }

        default:
            message.channel.send("Para acessar a lista de comandos digite !LMF help");
            break;
        
    }
});