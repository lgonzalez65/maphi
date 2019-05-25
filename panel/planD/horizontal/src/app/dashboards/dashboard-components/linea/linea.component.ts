import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { EVA } from '../../dashboard-maphi/EVA';
import { DashboardMaphiService } from '../../dashboard-maphi/dashboard-maphi.service';


@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css']
})
export class LineaComponent implements OnInit {

  @Input() evas: EVA[];
  public lineChartData: Array<any> = [
    { data: [], label: '' },
    { data: [], label: '' }];


  public lineChartLabels: Array<any>;
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';


  constructor(
    public _dashboardMaphiService: DashboardMaphiService
  ) {
   
    this.lineChartLabels =  [];

  }
  ngOnInit(): void {
 
    this.getFeeds(10);
    
  }

  public getFeeds(registros: number) {
    this._dashboardMaphiService.getFeeds(this.evas[0], registros).subscribe(
      result => {
        this.evas[0].canal = result;
        this.lineChartData = [this.evas[0].getField1(),this.evas[0].getField2()];
        let labels = this.evas[0].getCreatedAt();
        this.lineChartLabels.length = 0;
        for (let i = labels.length - 1; i >= 0; i--) {
          this.lineChartLabels.push(labels[i]);
        }
      }, error => { }
    );
  }



  public actualizar(): void {
    let _lineChartData: Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
    
  }

  public randomize(): void {
    let _lineChartData: Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
    
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


}