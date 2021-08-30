const Discord = require('discord.js');
const bot = new Discord.Client();
const api = require('./rest/apiCall.js');
const models = require('./models/index');
const prefix = process.env.DISCORD_PREFIX;;

if(process.env.DISCORD_TOKEN){
    const token = process.env.DISCORD_TOKEN;
    bot.login(token);
} else {
    let config = require ('./config.json')
    const token = config.token
    bot.login(token);
}
// if(process.env.DISCORD_PREFIX){
//     const prefix = process.env.DISCORD_PREFIX;;
// } else {
//     let config = require ('./config.json')//TODO transformar em variavel de escopo
//     const prefix = config.prefix
// }



bot.on('ready', () => {
    console.log("pronto")
    bot.user.setPresence({
        status: 'online',
        activity: {
            name: 'Liga do Mercado Financeiro da UFMS',
            type: 'WATCHING',
            url: 'https://www.youtube.com/watch?v=sTX0UEplF54'
        }
    })
});

bot.on('message', async message => {
    if(message.author.bot) return;
   
    let CompleteMessage = message.content.toUpperCase();
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
                        let valorCompra = args[3] * 100 * fechamento
                        const carteira =  models.carteira.findAll({
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
                                    let saldoNovo = saldo.saldo-valorCompra;
                                    try {
                                    const compra = models.carteira.update({
                                        ativos: ativos,
                                        saldo: saldoNovo
                                    }, {
                                        where: {
                                            discord_ID: id
                                        }
                                    });
                                    models.transacao.create({
                                        discord_ID: id,
                                        tipo: "compra",
                                        valorTransacao: valorCompra,
                                        ativo: ativo,
                                    })
                                    
                                    message.channel.send('Parabéns, você comprou '+args[3] + ' lotes de '+ativo+' e seu saldo agora é '+saldoNovo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
                                    
                                     } catch (error) {
                                         console.log(error)
                                         //t.rollback();
                                     }
                                    

                                } else{// verificar se ja existe esse ativo
                                    var ativo = new String(realMessage[2].toUpperCase()).substring(0,5);
                                    let ativos = saldo.ativos
                                    var arrayAtivos1 = ativos.split("/");
                                    let arrayAtivos = new String();
                                    var map = new Map();
                                    console.log(arrayAtivos1);
                                    arrayAtivos1.splice(arrayAtivos1.length-1, 1);
                                    for(var j=0;j<arrayAtivos1.length;j++){
                                        arrayAtivos = arrayAtivos1[j].split("=");
                                        
                                        if((arrayAtivos[1] != '') && !(arrayAtivos[2] != undefined)){
                                            map.set(arrayAtivos[0], arrayAtivos[1]);
                                            console.log("key = "+ arrayAtivos[0]+" value = "+ arrayAtivos[1])
                                        }
                                    }
                                    if(map.has(ativo)){
                                        const quantidadeNova = Number.parseInt(map.get(ativo), 10)+Number.parseInt(args[3], 10);
                                        console.log("Quantidade nova compra ", quantidadeNova)
                                        map.delete(ativo);
                                        map.set(ativo, quantidadeNova);
                                        ativos = '';
                                        map.forEach((value,key)=>{
                                            ativos += key+'='+value+'/';
                                            console.log(ativos);
                                        })
                                        
                                        try {
                                            let saldoNovo = saldo.saldo-valorCompra;
                                            const compra = models.carteira.update({
                                                ativos: ativos,
                                                saldo: saldoNovo
                                            }, {
                                                where: {
                                                    discord_ID: id
                                                }
                                            });
                                            models.transacao.create({
                                                discord_ID: id,
                                                tipo: "compra",
                                                valorTransacao: valorCompra,
                                                ativo: ativo,
                                            })
                                            message.channel.send('Parabéns, você comprou '+args[3] + ' lotes de '+ativo+' e seu saldo agora é '+saldoNovo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
                                            
                                            
                                                
                                        } catch (error) {
                                            console.log(error)
                                            //t.rollback();
                                        }
                                        
                                    } else {
                                        let saldoNovo = saldo.saldo-valorCompra;
                                        let ativos = saldo.ativos;
                                        ativos += ativo+'='+args[3]+'/';
                                        try {
                                            const compra = models.carteira.update({
                                                ativos: ativos,
                                                saldo: saldoNovo
                                            }, {
                                                where: {
                                                    discord_ID: id
                                                }
                                            });
                                            models.transacao.create({
                                                discord_ID: id,
                                                tipo: "compra",
                                                valorTransacao: valorCompra,
                                                ativo: ativo,
                                            })
                                            
                                            message.channel.send('Parabéns, você comprou '+args[3] + ' lotes de '+ativo+' e seu saldo agora é '+saldoNovo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
                                            
                                        } catch (error) {
                                            console.log(error)
                                            //t.rollback();
                                        }
                                    }
                                }
                            }
                       });
                    }
                }
            break; 
        case 'vender'://!LMF comprar PETR4 3
            if(!args[2]){// Se não for informado o nome do ativo
                message.channel.send('Por favor, informe qual ativo você quer vender.');
            } else {
                message.channel.send( `${author} validando os dados...`);
                let fechamento = api(args[2]);
                if(fechamento == null){//Se o ativo não for encontrado no request da API
                   message.channel.send('Este ativo não foi encontrado. Use o nome do ativo + .SAO. Exemplo: PETR4.SAO');
                   break;
                } else {//Busca no BD o usuário
                    let valorVenda = args[3] * 100 * fechamento
                    const carteira =  models.carteira.findAll({
                        where: {
                       discord_ID: id
                       },
                       raw: true,
                       plain: true
                   });
                   carteira.then(cart => {
                        const carteiraObj = JSON.parse(JSON.stringify(cart));
                        if(carteiraObj.ativos == null){
                            message.channel.send(`${author}, você não tem ativos na sua carteira.`)
                        } else {
                            const ativo = new String(realMessage[2].toUpperCase()).substring(0,5);
                            let ativos = carteiraObj.ativos;
                            let arrayAtivos1 = ativos.split("/");
                            let arrayAtivos = new String();
                            let map = new Map();
                            const quantidadeVenda = Number.parseInt(args[3], 10)
                            console.log("array ativos ",arrayAtivos1);
                            arrayAtivos1.splice(arrayAtivos1.length-1, 1);
                            for(let j=0;j<arrayAtivos1.length;j++){
                                arrayAtivos = arrayAtivos1[j].split("=");
                                
                                if((arrayAtivos[1] != '') && !(arrayAtivos[2] != undefined)){
                                    map.set(arrayAtivos[0], arrayAtivos[1]);
                                    console.log("key = "+ arrayAtivos[0]+" value = "+ arrayAtivos[1])
                                }
                            }
                            if(!(map.has(ativo))){
                                message.channel.send(`${author}, você não tem o ativo para vender.`)
                                
                            } else if(map.get(ativo) < quantidadeVenda){
                                message.channel.send("operação map.get(ativo) < Number.parseInt(args[3]), 10 = ", (map.get(ativo) < Number.parseInt(args[3])));
                                message.channel.send(`${author}, você não tem quantidade suficiente de ${ativo} para vender.`)
                                message.channel.send(`você tem ${map.get(ativo)} e está tentando vender ${args[3]}.`)
                            } else {
                                const quantidadeNova = Number.parseInt(map.get(ativo), 10)-Number.parseInt(args[3], 10);
                                console.log("Quantidade nova compra ", quantidadeNova)
                                if(quantidadeNova < 0){
                                    message.channel.send("Erro ao processar a sua solicitação");
                                } else if(quantidadeNova == 0){
                                    map.delete(ativo);
                                    ativos = '';
                                    map.forEach((value,key)=>{
                                        ativos += key+'='+value+'/';
                                        console.log("Ativos sem o ativo totalmente vendido ", ativos);
                                    })
                                    if(ativos == '')
                                        ativos = null
                                    console.log("Ativos sem o ativo totalmente vendido ", ativos);
                                    try {
                                        let saldoNovo = carteiraObj.saldo+valorVenda;
                                        const venda = models.carteira.update({
                                            ativos: ativos,
                                            saldo: saldoNovo
                                        }, {
                                            where: {
                                                discord_ID: id
                                            }
                                        });
                                        models.transacao.create({
                                            discord_ID: id,
                                            tipo: "venda",
                                            valorTransacao: valorVenda,
                                            ativo: ativo,
                                        })
                                        message.channel.send('Parabéns, você vendeu '+args[3] + ' lotes de '+ativo+' e seu saldo agora é '+saldoNovo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
                                        
                                        
                                            
                                    } catch (error) {
                                        console.log(error)
                                        //t.rollback();
                                    }
                                } else {
                                    map.delete(ativo);
                                    map.set(ativo, quantidadeNova);
                                    ativos = '';
                                    map.forEach((value,key)=>{
                                        ativos += key+'='+value+'/';
                                        console.log("Ativos subtraindo quantidade vendida ", ativos);
                                    })
                                    try {
                                        let saldoNovo = carteiraObj.saldo+valorVenda;
                                        const venda = models.carteira.update({
                                            ativos: ativos,
                                            saldo: saldoNovo
                                        }, {
                                            where: {
                                                discord_ID: id
                                            }
                                        });
                                        models.transacao.create({
                                            discord_ID: id,
                                            tipo: "venda",
                                            valorTransacao: valorVenda,
                                            ativo: ativo,
                                        })
                                        message.channel.send('Parabéns, você vendeu '+args[3] + ' lotes de '+ativo+' e seu saldo agora é '+saldoNovo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
                                        
                                        
                                            
                                    } catch (error) {
                                        console.log(error)
                                        //t.rollback();
                                    }
                                }                               
                            }
                        }
                   });
                }
            }
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
                        message.channel.send( `${author} Parabens, sua carteira foi criada!`);
                    } else {
                        if(saldo.ativos == null){
                            var f = saldo.saldo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                            message.channel.send( `${author} Seu saldo atual é: ${f}`);
                            message.channel.send( `E Sua carteira está vazia.`);

                        } else {
                            console.log("ativos ", saldo.ativos);
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
                console.log(cart);
                if(cart == null){
                    message.channel.send(`${author} você não tem uma carteira. Crie uma com "!${prefix} carteira"`);

                } else{
                    var saldo = JSON.parse(JSON.stringify(cart));
                    var f = saldo.saldo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                    message.channel.send( `${author} Seu saldo atual é de ${f}`);
                }
                
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
                    let valorTotalFormatado = valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

                    message.channel.send(`${author} parabéns, você comprou ${realMessage[3]} lotes de ${ativo} a ${fechamento} e utilizou o total de ${valorTotalFormatado} do seu saldo.`);
                    break; 
                }

        default:
            message.channel.send("Para acessar a lista de comandos digite !LMF help");
            break;
        
    }
});
