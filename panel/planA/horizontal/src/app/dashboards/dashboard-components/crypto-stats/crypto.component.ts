import { Component, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html'
})
export class CryptoComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    (<any>$('.crypto')).sparkline([6, 10, 9, 11, 9, 10, 12], {
      type: 'bar',
      height: '30',
      barWidth: '4',
      width: '100%',
      resize: true,
      barSpacing: '5',
      barColor: '#ffffff'
    });
  }
}
