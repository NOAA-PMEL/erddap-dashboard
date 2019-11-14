import { Injectable } from '@angular/core';
import {ConfigJson} from './config-json';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: any;
  constructor(private http: HttpClient) { }
  loadAppConfig() {
    return this.http.get('/assets/config.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }
  getMapQuery() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.mapQuery;
  }
  getDepthParameterBase() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.depthParameterBase;
  }
  getTimeseriesBase() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.timeseriesBase;
  }
  getTimeConstraint() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.timeConstraint;
  }
  getInitialZoom() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.initialZoom;
  }

}
