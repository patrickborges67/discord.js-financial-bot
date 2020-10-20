module.exports = {

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    },


    validaPregao(date){
        if(date.getDay == 6 ){
            date.setDate(date.getDate()-1);// se for Sabado pegar os dados de Sexta
        } else if(date.getDay == 0){
            date.setDate(date.getDate()-2);// se for Domingo pegar os dados de Sexta
        }else if(date.getHours > '18' && date.getHours < '24'){
            console.log('Horario OK');// pegando os dados de hoje pois a bolsa já fechou
        } else {
            date.setDate(date.getDate()-1);//Pegando os dados de ontem pois a bolsa ainda não fechou
        }
        return date;
    }       

}