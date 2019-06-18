var channelsLoaded7 = 0;
var channelKeys7 = [];

channelKeys7.push({
  channelNumber: 767978, name: 'EVA03', key: '7MLZOIYMQOXBO3I3',
  fieldList: [{ field: 1, axis: 'O' },{ field: 2, axis: 'O' }]
});

var iconoInterruptor1;
var iconoInterruptor2;
var interruptor1;
var interruptor2;

function interruptores() {
  channelsLoaded7 = 0;
  var last_date; // variable for the last date added to the chart

  var seriesCounter = 0
  for (var channelIndex = 0; channelIndex < channelKeys7.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys7[channelIndex].fieldList.length; fieldIndex++)  // iterate through each channel
    {
      channelKeys7[channelIndex].fieldList[fieldIndex].series = seriesCounter;
      seriesCounter++;
    }
  }
  for (var channelIndex = 0; channelIndex < channelKeys7.length; channelIndex++)  // iterate through each channel
  {
    channelKeys7[channelIndex].loaded = false;
    loadOnePoint7(channelKeys7[channelIndex].channelNumber, channelKeys7[channelIndex].key, channelKeys7[channelIndex].fieldList);

  }
}

function loadOnePoint7(channelNumber, key, sentFieldList) {

  var fieldList = sentFieldList;
  // get the Channel data with a webservice call
  $.getJSON('https://api.thingspeak.com/channels/' + channelNumber + '/feeds.json?results=1;key=' + key, function (data) {
    // if no access
    if (data == '-1') {
      window.console && console.log('Thingspeak Data Loading Error');
    }
    
    var actualizacion = [];

        var fieldStr = "data.feeds[0].field1";
        var v = eval(fieldStr);

        
        if (parseInt(v) == 1) {
          iconoInterruptor1="<i class='fas fa-play' style='vertical-align: middle; font-size: 5vh;'></>";
          interruptor1 = "Interruptor 1 Activado";
        }
        else {
          iconoInterruptor1="<i class='fas fa-stop' style='vertical-align: middle; font-size: 5vh;'></i>";
          interruptor1 = "Interruptor 1 Desactivado";
        }
        var fieldStr2 = "data.feeds[0].field2";
        var v2 = eval(fieldStr2);

        
        if (parseInt(v2) == 1) {
          iconoInterruptor2="<i class='fas fa-play' style='vertical-align: middle; font-size: 5vh;'></>";
          interruptor2 = "Interruptor 2 Activado";
        }
        else {
          iconoInterruptor2="<i class='fas fa-stop' style='vertical-align: middle; font-size: 5vh;'></i>";
          interruptor2 = "Interruptor 2 Desactivado";
        }
       
        document.querySelector('.IconoInterruptor1').innerHTML = iconoInterruptor1;
        document.querySelector('.IconoInterruptor2').innerHTML = iconoInterruptor2;
        document.querySelector('.Interruptor1').innerHTML = interruptor1;
        document.querySelector('.Interruptor2').innerHTML = interruptor2;
        
        actualizacion[channelNumber] = getFecha(data.feeds[0].created_at);
        document.querySelector('.Actualizacion' + channelNumber).innerHTML = actualizacion[channelNumber];

  })
  .fail(/*function () { alert('getJSON request failed! '); }*/);
}