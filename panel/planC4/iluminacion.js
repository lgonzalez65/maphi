
// Webpage Javascript to chart multiple ThingSpeak channels on two axis with navigator, load historical data, and export cvs data.
// Public Domain, by turgo.
//  The charting library is called HighStock.  It is awesome!  HighSoft, the owners say, 
//   "Do you want to use Highstock for a personal or non-profit project? Then you can use Highchcarts for 
//   free under the  Creative Commons Attribution-NonCommercial 3.0 License. "
var dynamicChart5;
var channelsLoaded5 = 0;
// put your ThingSpeak Channel#, Channel Name, and API keys here.
// fieldList shows which field you want to load, and which axis to display that field on, 
// the 'T' Temperature left axis, or the 'O' Other right axis.
var channelKeys5 = [];

channelKeys5.push({
  channelNumber: 767977, name: 'EVA02', key: '82CRJLA9J9JY41E7',
  fieldList: [{ field: 4, axis: 'I' }]
});

// user's timezone offset
var myOffset5 = new Date().getTimezoneOffset();

var iluminacionActual;

// converts date format from JSON
function getChartDate(d) {
  // get the data using javascript's date object (year, month, day, hour, minute, second)
  // months in javascript start at 0, so remember to subtract 1 when specifying the month
  // offset in minutes is converted to milliseconds and subtracted so that chart's x-axis is correct
  return Date.UTC(d.substring(0, 4), d.substring(5, 7) - 1, d.substring(8, 10), d.substring(11, 13), d.substring(14, 16), d.substring(17, 19)) - (myOffset5 * 60000);
}

// Hide all series, via 'Hide All' button.  Then user can click on serries name in legent to show series of interest.      
function HideAll5() {
  for (var index = 0; index < dynamicChart5.series.length; index++)  // iterate through each series
  {
    if (dynamicChart5.series[index].name == 'Navigator')
      continue;
    dynamicChart5.series[index].hide();
  }
}

//  This is where the chart is generated.
function iluminacion() {

  var last_date; // variable for the last date added to the chart
  //window.console && console.log('Testing console');
  //make series numbers for each field
  var seriesCounter = 0
  for (var channelIndex = 0; channelIndex < channelKeys5.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys5[channelIndex].fieldList.length; fieldIndex++)  // iterate through each channel
    {
      channelKeys5[channelIndex].fieldList[fieldIndex].series = seriesCounter;
      seriesCounter++;
    }
  }
  //make calls to load data from each channel into channelKeys5 array now
  // draw the chart when all the data arrives, later asyncronously add history

  for (var channelIndex = 0; channelIndex < channelKeys5.length; channelIndex++)  // iterate through each channel
  {
    channelKeys5[channelIndex].loaded = false;

    loadThingSpeakChannel5(channelIndex, channelKeys5[channelIndex].channelNumber, channelKeys5[channelIndex].key, channelKeys5[channelIndex].fieldList);

    loadOnePoint5(channelKeys5[channelIndex].channelNumber, channelKeys5[channelIndex].key, channelKeys5[channelIndex].fieldList);

  }
  //window.console && console.log('Channel Keys',channelKeys5);

}


// load the most recent 2500 points (fast initial load) from a ThingSpeak channel into a data[] array and return the data[] array
function loadThingSpeakChannel5(sentChannelIndex, channelNumber, key, sentFieldList) {
  var fieldList = sentFieldList;
  var channelIndex = sentChannelIndex;
  // get the Channel data with a webservice call
  $.getJSON('https://api.thingspeak.com/channels/' + channelNumber + '/feeds.json?results=1000;key=' + key, function (data) {
    // if no access
    if (data == '-1') {
      $('#chart-container5').append('This channel is not public.  To embed charts, the channel must be public or a read key must be specified.');
      window.console && console.log('Thingspeak Data Loading Error');
    }
    for (var fieldIndex = 0; fieldIndex < fieldList.length; fieldIndex++)  // iterate through each field
    {
      fieldList[fieldIndex].data = [];
      for (var h = 0; h < data.feeds.length; h++)  // iterate through each feed (data point)
      {
        var p = []//new Highcharts.Point();
        var fieldStr = "data.feeds[" + h + "].field" + fieldList[fieldIndex].field;
        var v = eval(fieldStr);
        p[0] = getChartDate(data.feeds[h].created_at);
        p[1] = parseFloat(v);
        // if a numerical value exists add it
        if (!isNaN(parseInt(v))) { fieldList[fieldIndex].data.push(p); }
      }
      fieldList[fieldIndex].name = eval("data.channel.field" + fieldList[fieldIndex].field);
    }
    channelKeys5[channelIndex].fieldList = fieldList;
    channelKeys5[channelIndex].loaded = true;
    channelsLoaded5++;
    if (channelsLoaded5 == channelKeys5.length) {
      createChart5();
    }
  })
    .fail(function () { alert('getJSON request failed! '); });
}

// create the chart when all data is loaded
function createChart5() {
  
  // specify the chart options
  var chartOptions = {
    chart:
    {
      /* backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [
                [0, '#2a2a2b'],
                [1, '#3e3e40']
            ]
       },*/
      renderTo: 'chart-container5',
      zoomType: 'y',
      events:
      {
        load: function () {}
      }
    },
    rangeSelector: {
      buttons: [{
        count: 30,
        type: 'minute',
        text: '30M'
      }, {
        count: 12,
        type: 'hour',
        text: '12H'
      }, {
        count: 1,
        type: 'day',
        text: 'D'
      }, {
        count: 1,
        type: 'week',
        text: 'S'
      }, {
        count: 1,
        type: 'month',
        text: 'M'
      }, {
        count: 1,
        type: 'year',
        text: 'A'
      }, {
        type: 'all',
        text: 'Todo'
      }],
      inputEnabled: false,
      selected: 0
    },
    title: {
     // text: 'ILUMINACION AMBIENTE',
      style: {
        color: '#000000',
        fontWeight: 'bold'
    }
    },
    colors: [  '#e0a800','#DF5353'  ],
    plotOptions: {
      line: {
        gapSize: 5
      },
      series: {
        marker: {
          radius: 2
        },
        animation: true,
        step: false,
        turboThrehold: 1000,
        borderWidth: 0,
        shadow: true,
        lineWidth: 3
      }
    },
    tooltip: {
      valueDecimals: 1,
      valueSuffix: '%',
      xDateFormat: '%d-%m-%Y<br/>%l:%M:%S %p'

    },
    xAxis: {
      type: 'datetime',
      ordinal: false,
      min: Date.UTC(2013, 02, 28),
      dateTimeLabelFormats: {
        hour: '%l %p',
        minute: '%l:%M %p'
      },
      title: {
        text: 'test'
      }
    },
    yAxis: [{
      title: {
        text: 'Iluminación %'
      },
      id: 'I'
    }],
    exporting: {
      enabled: false,
      csv: {
        dateFormat: '%d/%m/%Y %I:%M:%S %p'
      }
    },
    legend: {
      enabled: true
    },
    navigator: {
      enabled: false,
      //baseSeries: 0,  //select which series to show in history navigator, First series is 0
      series: {
        includeInCSVExport: false
      }
    },
    scrollbar: {
      enabled: false
  },
    series: []
    //series: [{data:[[getChartDate("2013-06-16T00:32:40Z"),75]]}]      
  };

  // add all Channel data to the chart
  for (var channelIndex = 0; channelIndex < channelKeys5.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys5[channelIndex].fieldList.length; fieldIndex++)  // add each field
    {
      //  window.console && console.log('ADD DATA: Channel ' + channelIndex + ' field ' + fieldIndex);
      chartOptions.series.push({
        data: channelKeys5[channelIndex].fieldList[fieldIndex].data,
        index: channelKeys5[channelIndex].fieldList[fieldIndex].series,
        yAxis: channelKeys5[channelIndex].fieldList[fieldIndex].axis,
        //visible:false,
        name: channelKeys5[channelIndex].fieldList[fieldIndex].name
      });
    }
  }
  // set chart labels here so that decoding occurs properly
  //chartOptions.title.text = data.channel.name;
  chartOptions.xAxis.title.text = 'Fecha';

  // draw the chart
  dynamicChart5 = new Highcharts.StockChart(chartOptions);

  // update series number to account for the navigator series (The historical series at the bottom) which is the first series.
  for (var channelIndex = 0; channelIndex < channelKeys5.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys5[channelIndex].fieldList.length; fieldIndex++)  // and each field
    {
      for (var seriesIndex = 0; seriesIndex < dynamicChart5.series.length; seriesIndex++)  // compare each series name
      {
        if (dynamicChart5.series[seriesIndex].name == channelKeys5[channelIndex].fieldList[fieldIndex].name) {
          channelKeys5[channelIndex].fieldList[fieldIndex].series = seriesIndex;
        }
      }
    }
  }

}


function loadOnePoint5( channelNumber, key, sentFieldList) {
 
  var fieldList = sentFieldList;
  // get the Channel data with a webservice call
  $.getJSON('https://api.thingspeak.com/channels/' + channelNumber + '/feeds.json?results=1;key=' + key, function (data) {
    // if no access
    if (data == '-1') {
      window.console && console.log('Thingspeak Data Loading Error');
    }
    for (var fieldIndex = 0; fieldIndex < fieldList.length; fieldIndex++)  // iterate through each field
    {
    
      for (var h = 0; h < data.feeds.length; h++)  // iterate through each feed (data point)
      {
        var p = []//new Highcharts.Point();
        var fieldStr = "data.feeds[" + h + "].field" + fieldList[fieldIndex].field;
        var v = eval(fieldStr);
        p[0] = getChartDate(data.feeds[h].created_at);
        iluminacionActual = (parseFloat(v)).toFixed(2);
        //document.querySelector('.IluminacionActual').innerHTML = "EVA-02: "+iluminacionActual;
        document.querySelector('.IluminacionActual').innerHTML = iluminacionActual+"%";
        // if a numerical value exists add it
      }
   
    }
   
  })
    .fail(function () { alert('getJSON request failed! '); });
}