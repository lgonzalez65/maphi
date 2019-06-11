var dynamicChart;
var channelsLoaded = 0;
var channelKeys = [];
channelKeys.push({
  channelNumber: 767976, name: 'EVA01', key: 'AFVIOUID8HRV2QPB',
  fieldList: [{ field: 1, axis: 'T' }, { field: 2, axis: 'H' }]
});
channelKeys.push({
  channelNumber: 767977, name: 'EVA02', key: '82CRJLA9J9JY41E7',
  fieldList: [{ field: 1, axis: 'T' }, { field: 2, axis: 'H' }, { field: 3, axis: 'O' }, { field: 4, axis: 'I' }, { field: 5, axis: 'C' }, { field: 6, axis: 'V' }]
});
channelKeys.push({
  channelNumber: 767978, name: 'EVA03', key: '7MLZOIYMQOXBO3I3',
  fieldList: [{ field: 1, axis: 'O' }, { field: 2, axis: 'O' }]
});
channelKeys.push({
  channelNumber: 773580, name: 'EVA04', key: 'VZUL9FI2B63SB4XS',
  fieldList: [{ field: 1, axis: 'O' }]
});
channelKeys.push({
  channelNumber: 774491, name: 'EVA05', key: 'FFKWWRSVJE2EL4ZW',
  fieldList: [{ field: 1, axis: 'O' }]
});

var myOffset = new Date().getTimezoneOffset();

function getChartDate(d) {
  return Date.UTC(d.substring(0, 4), d.substring(5, 7) - 1, d.substring(8, 10), d.substring(11, 13), d.substring(14, 16), d.substring(17, 19)) - (myOffset * 60000);
}
function HideAll() {
  for (var index = 0; index < dynamicChart.series.length; index++) {
    if (dynamicChart.series[index].name == 'Navigator')
      continue;
    dynamicChart.series[index].hide();
  }
}

$(document).ready(function () {
  var menu = document.getElementById("Channel Select");
  for (var channelIndex = 0; channelIndex < channelKeys.length; channelIndex++) {
    window.console && console.log('Name', channelKeys[channelIndex].name);
    var menuOption = new Option(channelKeys[channelIndex].name, channelIndex);
    menu.options.add(menuOption, channelIndex);
  }
  var last_date;
  window.console && console.log('Testing console');
  var seriesCounter = 0
  for (var channelIndex = 0; channelIndex < channelKeys.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex = 0; fieldIndex < channelKeys[channelIndex].fieldList.length; fieldIndex++)  // iterate through each channel
    {
      channelKeys[channelIndex].fieldList[fieldIndex].series = seriesCounter;
      seriesCounter++;
    }
  }

  for (var channelIndex = 0; channelIndex < channelKeys.length; channelIndex++)  // iterate through each channel
  {
    channelKeys[channelIndex].loaded = false;
    loadThingSpeakChannel(channelIndex, channelKeys[channelIndex].channelNumber, channelKeys[channelIndex].key, channelKeys[channelIndex].fieldList);

  }

  function loadThingSpeakChannel(sentChannelIndex, channelNumber, key, sentFieldList) {
    var fieldList = sentFieldList;
    var channelIndex = sentChannelIndex;
    $.getJSON('https://www.thingspeak.com/channels/' + channelNumber + '/feed.json?callback=?&amp;offset=0&amp;results=2500;key=' + key, function (data) {
      if (data == '-1') {
        $('#chart-container').append('This channel is not public.  To embed charts, the channel must be public or a read key must be specified.');
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
          if (!isNaN(parseInt(v))) { fieldList[fieldIndex].data.push(p); }
        }
        fieldList[fieldIndex].name = eval("data.channel.field" + fieldList[fieldIndex].field);
      }
      window.console && console.log('getJSON field name:', fieldList[0].name);
      channelKeys[channelIndex].fieldList = fieldList;
      channelKeys[channelIndex].loaded = true;
      channelsLoaded++;
      window.console && console.log('channels Loaded:', channelsLoaded);
      window.console && console.log('channel index:', channelIndex);
      if (channelsLoaded == channelKeys.length) { createChart(); }
    })
      .fail(function () { alert('getJSON request failed! '); });
  }

  function createChart() {

    var chartOptions = {
      chart:
      {
        renderTo: 'chart-container',
        zoomType: 'y',
        events:
        {
          load: function () {
            if ('true' === 'true' && (''.length < 1 && ''.length < 1 && ''.length < 1 && ''.length < 1 && ''.length < 1)) {

              setInterval(function () {
                if (document.getElementById("Update").checked) {
                  for (var channelIndex = 0; channelIndex < channelKeys.length; channelIndex++)  // iterate through each channel
                  {
                    (function (channelIndex) {

                      $.getJSON('https://www.thingspeak.com/channels/' + channelKeys[channelIndex].channelNumber + '/feed/last.json?callback=?&amp;offset=0&amp;location=false;key=' + channelKeys[channelIndex].key, function (data) {
                        for (var fieldIndex = 0; fieldIndex < channelKeys[channelIndex].fieldList.length; fieldIndex++) {

                          var fieldStr = "data.field" + channelKeys[channelIndex].fieldList[fieldIndex].field;
                          var chartSeriesIndex = channelKeys[channelIndex].fieldList[fieldIndex].series;
                          if (data && eval(fieldStr)) {
                            var p = []
                            var v = eval(fieldStr);
                            p[0] = getChartDate(data.created_at);
                            p[1] = parseFloat(v);

                            if (dynamicChart.series[chartSeriesIndex].data.length > 0) {
                              last_date = dynamicChart.series[chartSeriesIndex].data[dynamicChart.series[chartSeriesIndex].data.length - 1].x;
                            }
                            var shift = false;
                            if (!isNaN(parseInt(v)) && (p[0] != last_date)) {
                              dynamicChart.series[chartSeriesIndex].addPoint(p, true, shift);
                            }
                          }

                        }


                      });
                    })(channelIndex);
                  }
                }
              }, 15000);
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
          text: 'Temperature °C'
        },
        id: 'T'
      }, {
        title: {
          text: 'Humidity %'
        },
        opposite: true,
        id: 'H'
      },
      {
        title: {
          text: 'Ilumination %'
        },
        opposite: true,
        id: 'I'
      },
      {
        title: {
          text: 'Current A'
        },
        opposite: true,
        id: 'C'
      },
      {
        title: {
          text: 'Voltage V'
        },
        opposite: true,
        id: 'V'
      },
      {
        title: {
          text: 'Other'
        },
        opposite: true,
        id: 'O'
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
        baseSeries: 0,
        series: {
          includeInCSVExport: false
        }
      },
      series: []

    };


    for (var channelIndex = 0; channelIndex < channelKeys.length; channelIndex++)  // iterate through each channel
    {
      for (var fieldIndex = 0; fieldIndex < channelKeys[channelIndex].fieldList.length; fieldIndex++)  // add each field
      {
        window.console && console.log('Channel ' + channelIndex + ' field ' + fieldIndex);
        chartOptions.series.push({
          data: channelKeys[channelIndex].fieldList[fieldIndex].data,
          index: channelKeys[channelIndex].fieldList[fieldIndex].series,
          yAxis: channelKeys[channelIndex].fieldList[fieldIndex].axis,

          name: channelKeys[channelIndex].fieldList[fieldIndex].name
        });
      }
    }

    chartOptions.xAxis.title.text = 'Date';


    dynamicChart = new Highcharts.StockChart(chartOptions);


    for (var channelIndex = 0; channelIndex < channelKeys.length; channelIndex++)  // iterate through each channel
    {
      for (var fieldIndex = 0; fieldIndex < channelKeys[channelIndex].fieldList.length; fieldIndex++)  // and each field
      {
        for (var seriesIndex = 0; seriesIndex < dynamicChart.series.length; seriesIndex++)  // compare each series name
        {
          if (dynamicChart.series[seriesIndex].name == channelKeys[channelIndex].fieldList[fieldIndex].name) {
            channelKeys[channelIndex].fieldList[fieldIndex].series = seriesIndex;
          }
        }
      }
    }

    window.console && console.log('Channels: ', channelKeys.length);
    for (var channelIndex = 0; channelIndex < channelKeys.length; channelIndex++)  // iterate through each channel
    {
      window.console && console.log('channelIndex: ', channelIndex);
      (function (channelIndex) {

        loadChannelHistory(channelIndex, channelKeys[channelIndex].channelNumber, channelKeys[channelIndex].key, channelKeys[channelIndex].fieldList, 0, 1);
      }
      )(channelIndex);
    }
  }
});

function loadOneChannel() {
  var selectedChannel = document.getElementById("Channel Select");
  var maxLoads = document.getElementById("Loads").value;
  var channelIndex = selectedChannel.selectedIndex;
  loadChannelHistory(channelIndex, channelKeys[channelIndex].channelNumber, channelKeys[channelIndex].key, channelKeys[channelIndex].fieldList, 0, maxLoads);
}

function loadChannelHistory(sentChannelIndex, channelNumber, key, sentFieldList, sentNumLoads, maxLoads) {
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
  $.getJSON('https://www.thingspeak.com/channels/' + channelNumber + '/feed.json?callback=?&amp;offset=0&amp;start=2013-01-20T00:00:00;end=' + end + ';key=' + key, function (data) {
    if (data == '-1') {
      $('#chart-container').append('This channel is not public.  To embed charts, the channel must be public or a read key must be specified.');
      window.console && console.log('Thingspeak Data Loading Error');
    }
    for (var fieldIndex = 0; fieldIndex < fieldList.length; fieldIndex++) {
      for (var h = 0; h < data.feeds.length; h++) {
        var p = []
        var fieldStr = "data.feeds[" + h + "].field" + fieldList[fieldIndex].field;
        var v = eval(fieldStr);
        p[0] = getChartDate(data.feeds[h].created_at);
        p[1] = parseFloat(v);
        if (!isNaN(parseInt(v))) { fieldList[fieldIndex].data.push(p); }
      }
      fieldList[fieldIndex].data.sort(function (a, b) { return a[0] - b[0] });
      dynamicChart.series[fieldList[fieldIndex].series].setData(fieldList[fieldIndex].data, false);

    }
    channelKeys[channelIndex].fieldList = fieldList;
    dynamicChart.redraw()
    window.console && console.log('channel index:', channelIndex);
    numLoads++;
    if (numLoads < maxLoads) { loadChannelHistory(channelIndex, channelNumber, key, fieldList, numLoads, maxLoads); }
  });
}
