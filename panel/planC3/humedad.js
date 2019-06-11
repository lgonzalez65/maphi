
// Webpage Javascript to chart multiple ThingSpeak channels on two axis with navigator, load historical data, and export cvs data.
// Public Domain, by turgo.
//  The charting library is called HighStock.  It is awesome!  HighSoft, the owners say, 
//   "Do you want to use Highstock for a personal or non-profit project? Then you can use Highchcarts for 
//   free under the  Creative Commons Attribution-NonCommercial 3.0 License. "
var dynamicChart2;
var channelsLoaded2 = 0;
// put your ThingSpeak Channel#, Channel Name, and API keys here.
// fieldList shows which field you want to load, and which axis to display that field on, 
// the 'T' Temperature left axis, or the 'O' Other right axis.
var channelKeys2 = [];
channelKeys2.push({
  channelNumber: 767976, name: 'EVA01', key: 'AFVIOUID8HRV2QPB',
  fieldList: [{ field: 2, axis: 'H' }]
});
channelKeys2.push({
  channelNumber: 767977, name: 'EVA02', key: '82CRJLA9J9JY41E7',
  fieldList: [{ field: 2, axis: 'H' }]
});

// user's timezone offset
var myOffset2 = new Date().getTimezoneOffset();

// converts date format from JSON
function getChartDate2(d) {
  // get the data using javascript's date object (year, month, day, hour, minute, second)
  // months in javascript start at 0, so remember to subtract 1 when specifying the month
  // offset in minutes is converted to milliseconds and subtracted so that chart's x-axis is correct
  return Date.UTC(d.substring(0, 4), d.substring(5, 7) - 1, d.substring(8, 10), d.substring(11, 13), d.substring(14, 16), d.substring(17, 19)) - (myOffset2 * 60000);
}

// Hide all series, via 'Hide All' button.  Then user can click on serries name in legent to show series of interest.      
function HideAll2() {
  for (var index = 0; index < dynamicChart2.series.length; index++)  // iterate through each series
  {
    if (dynamicChart2.series[index].name == 'Navigator')
      continue;
    dynamicChart2.series[index].hide();
    //window.console && console.log('Series Number:',index,' Name:',dynamicChart2.series[index].name);
  }
  //});

}


//  This is where the chart is generated.
function humedad() {
  //Add Channel Load menu2
  /*var menu2 = document.getElementById("Channel Select 2");
  for (var channelIndex = 0; channelIndex < channelKeys2.length; channelIndex++)  // iterate through each channel
  {
    window.console && console.log('Name', channelKeys2[channelIndex].name);
    var menu2Option = new Option(channelKeys2[channelIndex].name, channelIndex);
    menu2.options.add(menu2Option, channelIndex);
  }*/
  var last_date; // variable for the last date added to the chart
  // window.console && console.log('Testing console');
  //make series numbers for each field
  var seriesCounter = 0
  for (var channelIndex = 0; channelIndex < channelKeys2.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys2[channelIndex].fieldList.length; fieldIndex++)  // iterate through each channel
    {
      channelKeys2[channelIndex].fieldList[fieldIndex].series = seriesCounter;
      seriesCounter++;
    }
  }
  //make calls to load data from each channel into channelKeys2 array now
  // draw the chart when all the data arrives, later asyncronously add history
  for (var channelIndex = 0; channelIndex < channelKeys2.length; channelIndex++)  // iterate through each channel
  {
    channelKeys2[channelIndex].loaded = false;
    loadThingSpeakChannel2(channelIndex, channelKeys2[channelIndex].channelNumber, channelKeys2[channelIndex].key, channelKeys2[channelIndex].fieldList);

  }
  //window.console && console.log('Channel Keys',channelKeys2);

}

// load the most recent 2500 points (fast initial load) from a ThingSpeak channel into a data[] array and return the data[] array
function loadThingSpeakChannel2(sentChannelIndex, channelNumber, key, sentFieldList) {
  var fieldList = sentFieldList;
  var channelIndex = sentChannelIndex;
  // get the Channel data with a webservice call
  $.getJSON('https://www.thingspeak.com/channels/' + channelNumber + '/feed.json?callback=?&amp;offset=0&amp;results=1000;key=' + key, function (data) {
    // if no access
    if (data == '-1') {
      $('#chart-container2').append('This channel is not public.  To embed charts, the channel must be public or a read key must be specified.');
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
        p[0] = getChartDate2(data.feeds[h].created_at);
        p[1] = parseFloat(v);
        // if a numerical value exists add it
        if (!isNaN(parseInt(v))) { fieldList[fieldIndex].data.push(p); }
      }
      fieldList[fieldIndex].name = eval("data.channel.field" + fieldList[fieldIndex].field);
    }
    window.console && console.log('getJSON field name:', fieldList[0].name);
    channelKeys2[channelIndex].fieldList = fieldList;
    channelKeys2[channelIndex].loaded = true;
    channelsLoaded2++;
    window.console && console.log('channels Loaded:', channelsLoaded2);
    window.console && console.log('channel index:', channelIndex);
    if (channelsLoaded2 == channelKeys2.length) { createChart2(); }
  })
    .fail(function () { alert('getJSON request failed! '); });
}
// create the chart when all data is loaded
function createChart2() {
  // specify the chart options
  var chartOptions = {
    chart:
    {
      renderTo: 'chart-container2',
      zoomType: 'y',
      events:
      {
        load: function () {
          if ('true' === 'true' && (''.length < 1 && ''.length < 1 && ''.length < 1 && ''.length < 1 && ''.length < 1)) {
            // If the update checkbox is checked, get latest data every 15 seconds and add it to the chart
            setInterval(function () {
              //if (document.getElementById("Update 2").checked) {
              for (var channelIndex = 0; channelIndex < channelKeys2.length; channelIndex++)  // iterate through each channel
              {
                (function (channelIndex) {
                  // get the data with a webservice call
                  $.getJSON('https://api.thingspeak.com/channels/' + channelKeys2[channelIndex].channelNumber + '/feed/last.json?key=' + channelKeys2[channelIndex].key, function (data) {
                    for (var fieldIndex = 0; fieldIndex < channelKeys2[channelIndex].fieldList.length; fieldIndex++) {
                      // if data exists
                      var fieldStr = "data.field" + channelKeys2[channelIndex].fieldList[fieldIndex].field;
                      var chartSeriesIndex = channelKeys2[channelIndex].fieldList[fieldIndex].series;
                      if (data && eval(fieldStr)) {
                        var p = []//new Highcharts.Point();
                        var v = eval(fieldStr);
                        p[0] = getChartDate2(data.created_at);
                        p[1] = parseFloat(v);
                        // get the last date if possible
                        if (dynamicChart2.series[chartSeriesIndex].data.length > 0) {
                          last_date = dynamicChart2.series[chartSeriesIndex].data[dynamicChart2.series[chartSeriesIndex].data.length - 1].x;
                        }
                        var shift = false; //default for shift
                        // if a numerical value exists and it is a new date, add it
                        if (!isNaN(parseInt(v)) && (p[0] != last_date)) {
                          dynamicChart2.series[chartSeriesIndex].addPoint(p, true, shift);
                        }
                      }
                      //window.console && console.log('channelKeys2:',channelKeys2);
                      //window.console && console.log('chartSeriesIndex:',chartSeriesIndex);
                      //window.console && console.log('channel index:',channelIndex);
                      //window.console && console.log('field index:',fieldIndex);
                      //window.console && console.log('update series name:',dynamicChart2.series[chartSeriesName].name);
                      //window.console && console.log('channel keys name:',channelKeys2[channelIndex].fieldList[fieldIndex].name);
                    }


                  });
                })(channelIndex);
              }
              // } if checked
            }, 60000); // recarga los datos cada 1 minuto
          }
        }
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
        text: 'W'
      }, {
        count: 1,
        type: 'month',
        text: 'M'
      }, {
        count: 1,
        type: 'year',
        text: 'Y'
      }, {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: true,
      selected: 1
    },
    title: {
      text: ''
    },
    plotOptions: {
      line: {
        gapSize: 5
        //color: '#d62020'
        //  },
        //  bar: {
        //color: '#d52020'
        //  },
        //  column: {
      },
      series: {
        marker: {
          radius: 2
        },
        animation: true,
        step: false,
        turboThrehold: 1000,
        borderWidth: 0
      }
    },
    tooltip: {
      valueDecimals: 1,
      valueSuffix: '°C',
      xDateFormat: '%d-%m-%Y<br/>%1:%M:%S %p'
      // reformat the tooltips so that local times are displayed
      //formatter: function() {
      //var d = new Date(this.x + (myOffset2*60000));
      //var n = (this.point.name === undefined) ? '' : '<br/>' + this.point.name;
      //return this.series.name + ':<b>' + this.y + '</b>' + n + '<br/>' + d.toDateString() + '<br/>' + d.toTimeString().replace(/\(.*\)/, "");
      //}
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
        text: 'Humidity %'
      },
      opposite: true,
      id: 'H'
    }],
    exporting: {
      enabled: true,
      csv: {
        dateFormat: '%d/%m/%Y %I:%M:%S %p'
      }
    },
    legend: {
      enabled: true
    },
    navigator: {
      baseSeries: 0,  //select which series to show in history navigator, First series is 0
      series: {
        includeInCSVExport: false
      }
    },
    series: []
    //series: [{data:[[getChartDate2("2013-06-16T00:32:40Z"),75]]}]      
  };

  // add all Channel data to the chart
  for (var channelIndex = 0; channelIndex < channelKeys2.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys2[channelIndex].fieldList.length; fieldIndex++)  // add each field
    {
      window.console && console.log('Channel ' + channelIndex + ' field ' + fieldIndex);
      chartOptions.series.push({
        data: channelKeys2[channelIndex].fieldList[fieldIndex].data,
        index: channelKeys2[channelIndex].fieldList[fieldIndex].series,
        yAxis: channelKeys2[channelIndex].fieldList[fieldIndex].axis,
        //visible:false,
        name: channelKeys2[channelIndex].fieldList[fieldIndex].name
      });
    }
  }
  // set chart labels here so that decoding occurs properly
  //chartOptions.title.text = data.channel.name;
  chartOptions.xAxis.title.text = 'Date';

  // draw the chart
  dynamicChart2 = new Highcharts.StockChart(chartOptions);

  // update series number to account for the navigator series (The historical series at the bottom) which is the first series.
  for (var channelIndex = 0; channelIndex < channelKeys2.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys2[channelIndex].fieldList.length; fieldIndex++)  // and each field
    {
      for (var seriesIndex = 0; seriesIndex < dynamicChart2.series.length; seriesIndex++)  // compare each series name
      {
        if (dynamicChart2.series[seriesIndex].name == channelKeys2[channelIndex].fieldList[fieldIndex].name) {
          channelKeys2[channelIndex].fieldList[fieldIndex].series = seriesIndex;
        }
      }
    }
  }
  // add all history
  //dynamicChart2.showLoading("Loading History..." );
  window.console && console.log('Channels: ', channelKeys2.length);
  for (var channelIndex = 0; channelIndex < channelKeys2.length; channelIndex++)  // iterate through each channel
  {
    window.console && console.log('channelIndex: ', channelIndex);
    (function (channelIndex) {
      //load only 1 set of 8000 points
      loadChannelHistory2(channelIndex, channelKeys2[channelIndex].channelNumber, channelKeys2[channelIndex].key, channelKeys2[channelIndex].fieldList, 0, 1);
    }
    )(channelIndex);
  }
}

function loadOneChannel2() {
  // load a Channel Select 2ed in the popUp menu2.
  var selectedChannel = document.getElementById("Channel Select 2");
  var maxLoads = document.getElementById("Loads2").value;
  var channelIndex = selectedChannel.selectedIndex;
  loadChannelHistory2(channelIndex, channelKeys2[channelIndex].channelNumber, channelKeys2[channelIndex].key, channelKeys2[channelIndex].fieldList, 0, maxLoads);
}

// load next 8000 points from a ThingSpeak channel and addPoints to a series
function loadChannelHistory2(sentChannelIndex, channelNumber, key, sentFieldList, sentNumLoads, maxLoads) {
  var numLoads = sentNumLoads
  var fieldList = sentFieldList;
  var channelIndex = sentChannelIndex;
  var first_Date = new Date();
  if (typeof fieldList[0].data[0] != "undefined") first_Date.setTime(fieldList[0].data[0][0] + 7 * 60 * 60 * 1000);//adjust for 7 hour difference from GMT (Zulu time)
  else if (typeof fieldList[1].data[0] != "undefined") first_Date.setTime(fieldList[1].data[0][0] + 7 * 60 * 60 * 1000);
  else if (typeof fieldList[2].data[0] != "undefined") first_Date.setTime(fieldList[2].data[0][0] + 7 * 60 * 60 * 1000);
  else if (typeof fieldList[3].data[0] != "undefined") first_Date.setTime(fieldList[3].data[0][0] + 7 * 60 * 60 * 1000);
  else if (typeof fieldList[4].data[0] != "undefined") first_Date.setTime(fieldList[4].data[0][0] + 7 * 60 * 60 * 1000);
  else if (typeof fieldList[5].data[0] != "undefined") first_Date.setTime(fieldList[5].data[0][0] + 7 * 60 * 60 * 1000);
  else if (typeof fieldList[6].data[0] != "undefined") first_Date.setTime(fieldList[6].data[0][0] + 7 * 60 * 60 * 1000);
  else if (typeof fieldList[7].data[0] != "undefined") first_Date.setTime(fieldList[7].data[0][0] + 7 * 60 * 60 * 1000);
  var end = first_Date.toJSON();
  window.console && console.log('earliest date:', end);
  window.console && console.log('sentChannelIndex:', sentChannelIndex);
  window.console && console.log('numLoads:', numLoads);
  // get the Channel data with a webservice call
  $.getJSON('https://www.thingspeak.com/channels/' + channelNumber + '/feed.json?callback=?&amp;offset=0&amp;start=2013-01-20T00:00:00;end=' + end + ';key=' + key, function (data) {
    // if no access
    if (data == '-1') {
      $('#chart-container2').append('This channel is not public.  To embed charts, the channel must be public or a read key must be specified.');
      window.console && console.log('Thingspeak Data Loading Error');
    }
    for (var fieldIndex = 0; fieldIndex < fieldList.length; fieldIndex++)  // iterate through each field
    {
      //fieldList[fieldIndex].data =[];
      for (var h = 0; h < data.feeds.length; h++)  // iterate through each feed (data point)
      {
        var p = []//new Highcharts.Point();
        var fieldStr = "data.feeds[" + h + "].field" + fieldList[fieldIndex].field;
        var v = eval(fieldStr);
        p[0] = getChartDate2(data.feeds[h].created_at);
        p[1] = parseFloat(v);
        // if a numerical value exists add it
        if (!isNaN(parseInt(v))) { fieldList[fieldIndex].data.push(p); }
      }
      fieldList[fieldIndex].data.sort(function (a, b) { return a[0] - b[0] });
      dynamicChart2.series[fieldList[fieldIndex].series].setData(fieldList[fieldIndex].data, false);
      //dynamicChart2.series[fieldList[fieldIndex].series].addPoint(fieldList[fieldIndex].data,false);
      //fieldList[fieldIndex].name = eval("data.channel.field"+fieldList[fieldIndex].field);
      //window.console && console.log('data added to series:',fieldList[fieldIndex].series,fieldList[fieldIndex].data);
    }
    channelKeys2[channelIndex].fieldList = fieldList;
    dynamicChart2.redraw()
    window.console && console.log('channel index:', channelIndex);
    numLoads++;
    if (numLoads < maxLoads) { loadChannelHistory2(channelIndex, channelNumber, key, fieldList, numLoads, maxLoads); }
  });
}
