import { Component, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-revenue-views',
  templateUrl: './revenue-views.component.html'
})
export class RevenueviewsComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    (<any>$('#ravenue')).sparkline(
      [6, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9, 10],
      {
        type: 'bar',
        height: '75',
        barWidth: '4',
        width: '100%',
        resize: true,
        barSpacing: '8',
        barColor: '#fff'
      }
    );
    (<any>$('#views')).sparkline([6, 10, 9, 11, 9, 10, 12], {
      type: 'line',
      height: '45',
      lineColor: 'transparent',
      fillColor: 'rgba(255, 255, 255, 0.3)',
      width: '100%',
      resize: true
    });
  }
}
