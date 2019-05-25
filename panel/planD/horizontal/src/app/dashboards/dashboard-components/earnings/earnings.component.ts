import { Component, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html'
})
export class EarningsComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    (<any>$('#active-users')).sparkline(
      [6, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9],
      {
        type: 'bar',
        height: '60',
        barWidth: '4',
        width: '100%',
        resize: true,
        barSpacing: '8',
        barColor: '#4fc3f7'
      }
    );
  }
}
