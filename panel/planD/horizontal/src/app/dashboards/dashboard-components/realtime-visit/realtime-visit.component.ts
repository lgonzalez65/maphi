import { Component, AfterViewInit } from '@angular/core';
import { RealtimeVisitService } from './realtime-visit.service';

import * as c3 from 'c3';

@Component({
  selector: 'app-realtime-visit',
  templateUrl: './realtime-visit.component.html',
  styleUrls: ['./realtime-visit.component.css']
})
export class RealtimevisitComponent implements AfterViewInit {

  public placa01: CanalThingSpeak;
  public valoresTemperatura1: string[];
  public valoresTemperatura2: string[];
  constructor(
    private _realtimeVisitService: RealtimeVisitService
  ) { }

  ngOnInit(): void {
    this.getFeeds();
  }

  getFeeds() {
    this.placa01 = null;
    this.valoresTemperatura1 = [];
    this.valoresTemperatura2 = [];

    this._realtimeVisitService.getFeeds().subscribe(
      result => {
        this.placa01 = result;
        this.valoresTemperatura1.push(this.placa01.channel.field2);
        for (let f of this.placa01.feeds) {
          if (f.field3 == null) {
            f.field3 = '0';
          }
          this.valoresTemperatura1.push(f.field3);
        }
        this.valoresTemperatura2.push(this.placa01.channel.field6);
        for (let f of this.placa01.feeds) {
          if (f.field6 == null) {
            f.field6 = '0';
          }
          this.valoresTemperatura2.push(f.field6);
        }
        this.ngAfterViewInit();

      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngAfterViewInit() {
    if (this.placa01 != null) {
      const chart = c3.generate({
        bindto: '#placeholder',
        data: {
          columns: [
            this.valoresTemperatura1, this.valoresTemperatura2
            /*[this.placa01.channel.field3, 30, 400, 100, 400, 150, 275, 135, 200, 218],
            [this.placa01.channel.field6, 130, 340, 200, 350, 250, 130, 189, 153, 258],
            [this.placa01.channel.field3, 1130, 1340, 1200, 3150, 250, 2130, 189, 1153, 258],
            [this.placa01.channel.field4, 2130, 2340, 2200, 3150, 1250, 130, 1189, 153, 1258]*/
          ],
          type: 'area-spline'
        },
        axis: {
          y: {
            show: true,
            tick: {
              count: 0,
              outer: false
            }
          },
          x: {
            show: true
          }
        },
        legend: {
          hide: true
        },
        color: {
          pattern: ['#2961ff', '#40c4ff']
        }
      });
    }
  }
}
