import { Component, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-mix-stats',
  templateUrl: './mix-stats.component.html',
  styleUrls: ['./mix-stats.component.css']
})
export class MixstatsComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    (<any>$('#visits')).sparkline(
      [
        6,
        10,
        9,
        11,
        9,
        10,
        12,
        10,
        9,
        11,
        9,
        10,
        12,
        10,
        9,
        11,
        9,
        9,
        11,
        9,
        10,
        12,
        10
      ],
      {
        type: 'bar',
        height: '60',
        barWidth: '4',
        width: '100%',
        resize: true,
        barSpacing: '6',
        barColor: '#4dd0e1'
      }
    );

    const chart = c3.generate({
      bindto: '.earningsbox1',
      data: {
        columns: [
          ['Site A', 5, 6, 3, 7, 9, 10, 14, 12, 11, 9, 8, 7, 10, 6, 12, 10, 8]
        ],
        type: 'area-spline'
      },
      axis: {
        y: {
          show: false,
          tick: {
            count: 0,
            outer: false
          }
        },
        x: {
          show: false
        }
      },
      padding: {
        top: 0,
        right: -8,
        bottom: -28,
        left: -8
      },
      point: {
        r: 0
      },
      legend: {
        hide: true
      },
      color: {
        pattern: ['#2961ff']
      }
    });

    const chart2 = c3.generate({
      bindto: '#visitor1',
      data: {
        columns: [['Success', 45], ['Pending', 15], ['Failed', 27]],
        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        title: '75%',
        width: 25
      },
      legend: {
        hide: true
      },
      color: {
        pattern: ['#40c4ff', '#2961ff', '#ff821c']
      }
    });
  }
}
