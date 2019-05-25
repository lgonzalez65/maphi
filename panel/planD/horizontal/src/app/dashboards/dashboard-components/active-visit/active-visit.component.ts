import { Component, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-active-visit',
  templateUrl: './active-visit.component.html',
  styleUrls: ['./active-visit.component.css']
})
export class ActivevisitComponent implements AfterViewInit {
  public config: PerfectScrollbarConfigInterface = {};

  constructor() {}

  ngAfterViewInit() {
    (<any>$('#active-users')).sparkline(
      [6, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9, 10, 12],
      {
        type: 'bar',
        height: '60',
        barWidth: '4',
        width: '100%',
        resize: true,
        barSpacing: '8',
        barColor: '#2961ff'
      }
    );

    const chart = c3.generate({
      bindto: '#visitor',
      data: {
        columns: [
          ['Open', 45],
          ['Clicked', 15],
          ['Un-opened', 27],
          ['Bounced', 18]
        ],
        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        title: 'Visits',
        width: 35
      },
      legend: {
        hide: true
      },
      color: {
        pattern: ['#40c4ff', '#2961ff', '#ff821c', '#7e74fb']
      }
    });
  }
}
