
var channelsLoaded7 = 0;
var channelKeys7 = [];

channelKeys7.push({
  channelNumber: 767978, name: 'EVA03', key: '7MLZOIYMQOXBO3I3',
  fieldList: [{ field: 1, axis: 'O' },{ field: 2, axis: 'O' }]
});


var interruptor1;
var interruptor2;

function interruptores() {

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
    
        var fieldStr = "data.feeds[0].field1";
        var v = eval(fieldStr);

        //p[0] = getChartDate(data.feeds[h].created_at);
        if (parseInt(v) == 1) {
          interruptor1 = "<i class='fas fa-play'> Interruptor 1 Activado</i>";
        }
        else {
          interruptor1 = "<i class='fas fa-stop'> Interruptor 1 Desactivado</i>";
        }
        var fieldStr2 = "data.feeds[0].field2";
        var v2 = eval(fieldStr2);

        //p[0] = getChartDate(data.feeds[h].created_at);
        if (parseInt(v2) == 1) {
          interruptor2 = "<i class='fas fa-play'> Interruptor 2 Activado</i>";
        }
        else {
          interruptor2 = "<i class='fas fa-stop'> Interruptor 2 Desactivado</i>";
        }
       
        
        document.querySelector('.Interruptor1').innerHTML = interruptor1;
        document.querySelector('.Interruptor2').innerHTML = interruptor2;
        // if a numerical value exists add it

  })
    .fail(function () { alert('getJSON request failed! '); });
}