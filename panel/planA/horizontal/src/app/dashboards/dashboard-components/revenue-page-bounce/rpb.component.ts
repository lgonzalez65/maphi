import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-rpb',
  templateUrl: './rpb.component.html',
  styleUrls: ['./rpb.component.css']
})
export class RpbComponent implements AfterViewInit {
  constructor() {}

  public lineChartData: Array<any> = [
    { data: [12, 19, 3, 5, 2, 3], label: 'Bounce %' }
  ];
  public lineChartLabels: Array<any> = [
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017'
  ];
  public lineChartOptions: any = {
    responsive: true,
    elements: {
      point: {
        radius: 2
      }
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ]
    }
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: '#2961ff',
      pointBackgroundColor: '#2961ff',
      pointBorderColor: '#2961ff',
      pointHoverBackgroundColor: '#2961ff',
      pointHoverBorderColor: '#2961ff'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';

  ngAfterViewInit() {
    const sparklineLogin = function() {
      (<any>$('#ravenue')).sparkline([6, 10, 9, 11, 9, 10, 12], {
        type: 'bar',
        height: '100',
        barWidth: '4',
        width: '100%',
        resize: true,
        barSpacing: '11',
        barColor: '#fff'
      });
      (<any>$('#views')).sparkline([6, 10, 9, 11, 9, 10, 12], {
        type: 'line',
        height: '72',
        lineColor: 'transparent',
        fillColor: 'rgba(255, 255, 255, 0.3)',
        width: '100%',
        resize: true
      });
    };
    sparklineLogin();
  }
}
