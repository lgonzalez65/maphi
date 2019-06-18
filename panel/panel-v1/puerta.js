
var channelsLoaded6 = 0;
var channelKeys6 = [];

channelKeys6.push({
  channelNumber: 767977, name: 'EVA02', key: '82CRJLA9J9JY41E7',
  fieldList: [{ field: 3, axis: 'O' }]
});


var estadoPuerta;
var iconoPuerta;

function aperturaPuerta() {

  channelsLoaded6 = 0;
  var last_date; // variable for the last date added to the chart

  var seriesCounter = 0
  for (var channelIndex = 0; channelIndex < channelKeys6.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys6[channelIndex].fieldList.length; fieldIndex++)  // iterate through each channel
    {
      channelKeys6[channelIndex].fieldList[fieldIndex].series = seriesCounter;
      seriesCounter++;
    }
  }
  for (var channelIndex = 0; channelIndex < channelKeys6.length; channelIndex++)  // iterate through each channel
  {
    channelKeys6[channelIndex].loaded = false;
    loadOnePoint6(channelKeys6[channelIndex].channelNumber, channelKeys6[channelIndex].key, channelKeys6[channelIndex].fieldList);

  }
}

function loadOnePoint6(channelNumber, key, sentFieldList) {

  var fieldList = sentFieldList;
  // get the Channel data with a webservice call
  $.getJSON('https://api.thingspeak.com/channels/' + channelNumber + '/feeds.json?results=1;key=' + key, function (data) {
    // if no access
    if (data == '-1') {
      window.console && console.log('Thingspeak Data Loading Error');
    }
    
    var actualizacion = [];
        var fieldStr = "data.feeds[0].field3";
        var v = eval(fieldStr);

        
        if (parseInt(v) == 1) {
          iconoPuerta = "<i class='fas fa-door-open' style='vertical-align: middle; font-size: 5vh;'></i>";
          estadoPuerta = "Puerta Abierta";
        }
        else {
          iconoPuerta = "<i class='fas fa-door-closed' style='vertical-align: middle; font-size: 5vh;'></i>";
          estadoPuerta = "Puerta Cerrada";
        }
       
        //document.querySelector('.estadoPuerta').innerHTML = "EVA-02: "+estadoPuerta;
        document.querySelector('.EstadoPuerta').innerHTML = estadoPuerta;
        document.querySelector('.IconoPuerta').innerHTML = iconoPuerta;
       
        actualizacion[channelNumber] = getFecha(data.feeds[0].created_at);
        document.querySelector('.Actualizacion' + channelNumber).innerHTML = actualizacion[channelNumber];

  })
  .fail(/*function () { alert('getJSON request failed! '); }*/);
}