import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardMaphiService } from './dashboard-maphi.service';
import { EVA } from './EVA';

@Component({
  selector: 'app-dashboard-maphi',
  templateUrl: './dashboard-maphi.component.html',
  styleUrls: ['./dashboard-maphi.component.css']
})
export class DashboardMaphiComponent implements AfterViewInit {

  public eva01: EVA;
  public eva02: EVA;
  public eva03: EVA;
  public eva04: EVA;
  public eva05: EVA;
  public evas: EVA[] = [];

  constructor(
    public _maphiDashboardService: DashboardMaphiService
  ) {
    this.eva01 = new EVA("EVA-01", "Sensor de Temperatura y Humedad", "767976", "AFVIOUID8HRV2QPB");
    this.eva02 = new EVA("EVA-02", "Sensor de Temperatura, Humedad, Puerta e Iluminacion", "767977", "82CRJLA9J9JY41E7");
    this.evas.push(this.eva01);
    this.evas.push(this.eva02);
  }

  ngAfterViewInit() {

   
  }


}
