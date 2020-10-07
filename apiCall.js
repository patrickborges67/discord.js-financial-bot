const config = require('./config.json');


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
module.exports = {
        
     apiGet(symbol){
        try{
            var http = require('https');
            var date = new Date();
            
            if(date.getDay == 6 ){
                date.setDate(date.getDate()-1);// se for Sabado pegar os dados de Sexta
            } else if(date.getDay == 0){
                date.setDate(date.getDate()-2);// se for Domingo pegar os dados de Sexta
            }else if(date.getHours > '18'){
                console.log('Horario OK');// pegando os dados de hoje pois a bolsa já fechou
                
            } else {
                date.setDate(date.getDate()-1);//Pegando os dados de ontem pois a bolsa ainda não fechou
            }
            
            var time = new Date();
            var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&apikey='+config.key;
            
            
            http.get(url, function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    var api = JSON.parse(body);
                    var apiString = JSON.stringify(body);
                    var fechamento = api['Time Series (Daily)']['2020-10-06']['4. close'];
                    console.log("API fechamento: ", fechamento);
                    var now = new Date();

                    var tempo = now.getMilliseconds() - time.getMilliseconds();
                    console.log(`tempo para a API fazer o request: ${tempo}`);
                    return fechamento;
                });

            }).on('error', function (e) {
                console.log("Got an error: ", e);
            });
        
        }catch(err){
            console.log(err)
    }
}
};