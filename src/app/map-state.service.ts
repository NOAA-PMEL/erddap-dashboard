import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ErddapJson} from './erddap-json';
import {ConfigJson} from './config-json';
import {AppConfigService} from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {
  static homeLon = -90.0659;
  static homeLat = 25.3043;
  icon = 'assets/icons/icon001.png';
  // dataUrl = '/erddap/tabledap/osmc_data_70dd_83c4_2cb6.json?platform_code%2Cplatform_type%2Ctime%2Clongitude%2Clatitude&distinct()&time>=2019-08-19T23:59:00Z&orderByMax("platform_code,time")';

  dataUrl;
  currentLon = MapStateService.homeLon;
  currentLat = MapStateService.homeLat;
  currentZoom;
  initialZoom;
  constrain;
  message: string = 'Loading recently reporting platforms...';
  returnedRows = [];
  markersFinished = false;
  rowCount;
  processedRows;
  showProgress = true;
  constructor(private httpClient: HttpClient, private appConfig: AppConfigService) {
       this.dataUrl = appConfig.getMapQuery();
       this.currentZoom = appConfig.getInitialZoom();
       this.initialZoom = appConfig.getInitialZoom();
  }
  onNgIni;
  reCenter() {
    this.currentLon = MapStateService.homeLon;
    this.currentLat = MapStateService.homeLat;
    this.currentZoom = this.initialZoom;
    this.message = undefined;
  }

  getMarkers(latMin, latMax, lonMin, lonMax) {
    this.constrain = this.dataUrl + '&latitude>=' + latMin + '&latitude<=' + latMax + '&longitude>=' + lonMin + '&longitude<=' + lonMax;
    // this.constrain = this.dataUrl;
    this.processedRows = 0;
    console.log(this.constrain);
    return this.httpClient.get<ErddapJson>(this.constrain);
    this.message = 'Getting platform locations...';
  }
  getMarkerColor(platformType) {
    this.processedRows++;
    if ( platformType === 'AUTONOMOUS PINNIPEDS') { return 'assets/icons/icon001.png'; }
    if ( platformType === 'C-MAN WEATHER STATIONS' ) {return 'assets/icons/icon002.png'; }
    if ( platformType === 'CLIMATE REFERENCE MOORED BUOYS' ) { return 'assets/icons/icon003.png'; }
    if ( platformType === 'DRIFTING BUOYS (GENERIC)') { return 'assets/icons/icon004.png'; }
    if ( platformType === 'GLIDERS') { return 'assets/icons/icon005.png'; }
    if ( platformType === 'GLOSS') {return 'assets/icons/icon006.png'}
    if ( platformType === 'ICE BUOYS') {return 'assets/icons/icon007.png'}
    if ( platformType === 'MOORED BUOYS (GENERIC)') { return 'assets/icons/icon008.png'; }
    if ( platformType === 'OCEAN TRANSPORT STATIONS (GENERIC)') { return 'assets/icons/icon009.png'; }
    if ( platformType === 'PROFILING FLOATS AND GLIDERS (GENERIC)') { return 'assets/icons/icon010.png'; }
    if ( platformType === 'RESEARCH') { return 'assets/icons/icon011.png'; }
    if ( platformType === 'SHIPS (GENERIC)') { return 'assets/icons/icon012.png'; }
    if ( platformType === 'SHIPS' ) {return 'assets/icons/icon013.png'}
    if ( platformType === 'SHORE AND BOTTOM STATIONS (GENERIC)') { return 'assets/icons/icon014.png'; }
    if ( platformType === 'TIDE GAUGE STATIONS (GENERIC)') { return 'assets/icons/icon015.png'; }
    if ( platformType === 'TROPICAL MOORED BUOYS') { return 'assets/icons/icon016.png'; }
    if ( platformType === 'TSUNAMI WARNING STATIONS') { return 'assets/icons/icon017.png'; }
    if ( platformType === 'UNKNOWN') { return 'assets/icons/icon018.png'; }
    if ( platformType === 'UNMANNED SURFACE VEHICLE' ) {return 'assets/icons/icon019.png'}
    if ( platformType === 'VOLUNTEER OBSERVING SHIPS') { return 'assets/icons/icon020.png'; }
    if ( platformType === 'VOLUNTEER OBSERVING SHIPS (GENERIC)') { return 'assets/icons/icon021.png'; }
    if ( platformType === 'VOSCLIM') { return 'assets/icons/icon022.png'; }
    if ( platformType === 'WEATHER AND OCEAN OBS') { return 'assets/icons/icon023.png'; }
    if ( platformType === 'WEATHER BUOYS') { return 'assets/icons/icon024.png'; }
    if ( platformType === 'WEATHER OBS') { return 'assets/icons/icon025.png'; }
    return 'assets/icons/icon026.png';
  }
  plotTypes(platformType) {
    if ( platformType === 'AUTONOMOUS PINNIPEDS') { return 'profile'; }
    if ( platformType === 'C-MAN WEATHER STATIONS' ) {return 'surface'; }
    if ( platformType === 'CLIMATE REFERENCE MOORED BUOYS' ) { return 'profile'; }
    if ( platformType === 'DRIFTING BUOYS (GENERIC)') { return 'surface'; }
    if ( platformType === 'GLIDERS') { return 'profile'; }
    if ( platformType === 'GLOSS') {return 'both'} // Undefined for variables?
    if ( platformType === 'ICE BUOYS') {return 'both'} // Undefined for variables?
    if ( platformType === 'MOORED BUOYS (GENERIC)') { return 'surface'; }
    if ( platformType === 'OCEAN TRANSPORT STATIONS (GENERIC)') { return 'profile'; }
    if ( platformType === 'PROFILING FLOATS AND GLIDERS (GENERIC)') { return 'profile'; }
    if ( platformType === 'RESEARCH') { return 'surface'; }
    if ( platformType === 'SHIPS (GENERIC)') { return 'surface'; }
    if ( platformType === 'SHIPS' ) {return 'surface'}  // Undefined for variables
    if ( platformType === 'SHORE AND BOTTOM STATIONS (GENERIC)') { return 'both'; }
    if ( platformType === 'TIDE GAUGE STATIONS (GENERIC)') { return 'surface'; }
    if ( platformType === 'TROPICAL MOORED BUOYS') { return 'both'; }
    if ( platformType === 'TSUNAMI WARNING STATIONS') { return 'surface'; }
    if ( platformType === 'UNKNOWN') { return 'surface'; }
    if ( platformType === 'UNMANNED SURFACE VEHICLE' ) {return 'both'} // Undefined for variables
    if ( platformType === 'VOLUNTEER OBSERVING SHIPS') { return 'surface'; }
    if ( platformType === 'VOLUNTEER OBSERVING SHIPS (GENERIC)') { return 'surface'; }
    if ( platformType === 'VOSCLIM') { return 'surface'; }
    if ( platformType === 'WEATHER AND OCEAN OBS') { return 'surface'; }
    if ( platformType === 'WEATHER BUOYS') { return 'surface'; }
    if ( platformType === 'WEATHER OBS') { return 'surface'; }
    return 'both';
  }
}
