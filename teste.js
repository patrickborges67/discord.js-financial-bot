const config = require('./config.json');
const api = require('./rest/apiCall.js');
//const models = require('./models/index')


// var a = 'PETR4.SAO'
// var quantidade = 5
// let fechamento = api(a);
// if(fechamento == null){
//     console.log('Este ativo não foi encontrado. Use o nome do ativo + .SAO. Exemplo: PETR4.SAO');
    
// } else{
//     var ativo = new String(a.toUpperCase()).substring(0,5);                   
//     var valorTotal = fechamento * quantidade;

//     fechamento = fechamento.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
//     valorTotal = valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

//     console.log(`parabéns, você comprou ${quantidade} lotes de ${ativo} a ${fechamento} e utilizou o total de ${valorTotal} do seu saldo.`);
    
// }
const date = new Date();
console.log(date.toString())
date.setHours(date.getHours - 4)
console.log(date.toString())