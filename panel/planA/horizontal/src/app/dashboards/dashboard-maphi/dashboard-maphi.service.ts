import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {EVA } from './EVA';


@Injectable({
  providedIn: 'root'
})
export class DashboardMaphiService {

  constructor(
    public _http: Http

  ) {

  }

  getFeeds(eva: EVA,registros: number){
    return this._http.get('https://api.thingspeak.com/channels/'+eva.canalID+'/feeds.json?results='+registros+'&status=true&api_key='+eva.api_key).map(res => res.json());
  }
}