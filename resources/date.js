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
        var hours = date.getHours();
        console.log(hours+'Hrs')
        if(date.getDay == 6 ){
            date.setDate(date.getDate()-1);// se for Sabado pegar os dados de Sexta
        } else if(date.getDay == 0){
            date.setDate(date.getDate()-2);// se for Domingo pegar os dados de Sexta
        }else if(hours > 18 & hours <= 23){
           console.log('Horario OK, fechamento de hoje');// pegando os dados de hoje pois a bolsa já fechou
        } else if(date.getDay == 1){
            date.setDate(date.getDate()-3);// se for Segunda antes do fim do pregao pegar os dados de Sexta
        } else {
            date.setDate(date.getDate()-1);//Pegando os dados de ontem pois a bolsa ainda não fechou
        }
        return date;
        
    }       

}