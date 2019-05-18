import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class RealtimeVisitService {

  constructor(
    public _http: Http

  ) {

  }

  getFeeds(){
    return this._http.get('https://api.thingspeak.com/channels/735377/feeds.json?results=100').map(res => res.json());
  }
}