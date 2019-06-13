
var channelsLoaded6 = 0;
var channelKeys6 = [];

channelKeys6.push({
  channelNumber: 767977, name: 'EVA02', key: '82CRJLA9J9JY41E7',
  fieldList: [{ field: 3, axis: 'O' }]
});


var estadoPuerta;

function estadoPuerta() {

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
    
        var fieldStr = "data.feeds[0].field3";
        var v = eval(fieldStr);

        //p[0] = getChartDate(data.feeds[h].created_at);
        if (parseInt(v) == 0) {
          estadoPuerta = 'ABIERTA';
        }
        else {
          estadoPuerta = 'CERRADA';
        }
       
        //document.querySelector('.estadoPuerta').innerHTML = "EVA-02: "+estadoPuerta;
        document.querySelector('.EstadoPuerta').innerHTML = estadoPuerta.toString;
        // if a numerical value exists add it

  })
    .fail(function () { alert('getJSON request failed! '); });
}