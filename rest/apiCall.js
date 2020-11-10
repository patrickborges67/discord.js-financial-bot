const apiKey = process.env.API_KEY;
const request = require('sync-request');
const validDate = require('../resources/date')



function apiGet(symbol){
    
    var date = new Date();
    date = validDate.validaPregao(date);
     
    try {
        var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&apikey='+apiKey;
        var res = request('GET', url);
        var api = JSON.parse(res.getBody());
        var fechamento = api['Time Series (Daily)'][validDate.formatDate(date)]['4. close'];
        
    } catch (error) {
        console.log(error)
        fechamento = null;
    }
    return fechamento;
}

module.exports = apiGet;