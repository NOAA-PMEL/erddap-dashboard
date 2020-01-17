import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import { latLng, marker, tileLayer, icon, Layer } from 'leaflet';
import {MapStateService} from '../map-state.service';
import {ErddapDataService} from '../erddap-data.service';
import {ErddapJson} from '../erddap-json';

@Component({
  selector: 'app-dashboard-leaflet',
  templateUrl: './dashboard-leaflet.component.html',
  styleUrls: ['./dashboard-leaflet.component.css']
})
export class DashboardLeafletComponent implements OnInit {

  index;
  options;
  layers: Layer[] = [];
  erddapJson: ErddapJson;
  constructor(public mapState: MapStateService, public erddapDataService: ErddapDataService) {
    addEventListener('plot', (evt: CustomEvent) => {
      const code = evt.detail.code;
      const type = evt.detail.type;
      const plot_type = evt.detail.plot_type;
      mapState.message = undefined;
      erddapDataService.errorMessage = undefined;
      if ( plot_type === 'surface' ) {
        erddapDataService.getSurface(code, type);
      } else {
        erddapDataService.getDepth(code, type);
      }
    });
  }

  ngOnInit() {
    this.onResize()
    this.options = {
      zoom: 5,
      center: latLng(this.mapState.currentLat, this.mapState.currentLon)
    };
    this.layers.push(tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }));
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.erddapDataService.innerWidth = window.innerWidth;
    this.erddapDataService.innerHeight = window.innerHeight;
  }
  onMapReady($event) {
    this.onResize();
    this.mapState.showProgress = true;
    this.getGloabalMarkers();
  }
  getGloabalMarkers() {
    this.mapState.getMarkers(-90., 90, -180., 180)
      .subscribe(data => {
          this.erddapJson = data;
          this.mapState.returnedRows = this.erddapJson.table.rows;
          this.mapState.message = undefined;
          console.log(' first row location; lon =  ' + this.mapState.returnedRows[0][3]);
          console.log(' first row location; lat =  ' + this.mapState.returnedRows[0][4]);
          this.mapState.rowCount = this.mapState.returnedRows.length;
          this.index = 0;
          for (let i = 0; i < this.mapState.rowCount; i++) {
            const row = this.erddapJson.table.rows.pop();
            const newMarker = marker(
              [row[4], row[3]],
              {
                icon: icon({
                  // iconSize: [ 25, 41 ],
                  // iconAnchor: [ 13, 41 ],
                  iconUrl: this.mapState.getMarkerColor(row[1])
                }),
              }
            ).bindPopup(fl => this.makeMarkerPopup(row, this.mapState.plotTypes(row[1])));
            newMarker.on('popupopen', function() {
              let b = document.getElementById(row[0] + "_surface");
              if ( b ) {
                b.addEventListener('click', (event: Event) => {
                  let c_event = new CustomEvent("plot", {detail: {code: row[0], type: row[1], plot_type: 'surface'}, bubbles: true});
                  b.dispatchEvent(c_event);
                });
              }
              let p = document.getElementById(row[0] + "_profile");
              if (p) {
                p.addEventListener('click', (event: Event) => {
                  let c_event = new CustomEvent("plot", {detail: {code: row[0], type: row[1], plot_type: 'profile'}, bubbles: true});
                  p.dispatchEvent(c_event);
                });
              }
            });
            this.index++;
            this.layers.push(newMarker);
          }
          this.mapState.showProgress = false;
        },
        error => {
          this.mapState.showProgress = false;
          this.mapState.message = 'No platforms found in this area.';
        },
        () => {
          if (this.index === this.mapState.rowCount) {
            this.mapState.message = 'All ' + this.index + ' platforms found have been added to the map.';
          } else {
            this.mapState.message = 'Error adding platforms. ' + this.index + ' out of ' + this.mapState.rowCount + ' platforms added to the map.';
          }
          this.mapState.markersFinished = true;
          this.mapState.showProgress = false;
        });
  }
  makeMarkerPopup(row: any, plotType: string) {
    let content = '<h1>Platform Code = ' + row[0] + '</h1>' +
      '<hr>' +
      '<h3>Platform Type = ' + row[1] + '</h3>' +
      '<h3>Most recent reporting time = ' + row[2] + '</h3>';
    if ( plotType === 'both' || plotType === 'surface' ) {
      content = content + '<button id="' + row[0] + '_surface" color="primary" mat-raised-button="" class="mat-raised-button mat-button-base mat-primary" ng-reflect-color="primary"><span class="mat-button-wrapper">Timeseries</span><div class="mat-button-ripple mat-ripple" matripple="" ng-reflect-centered="false" ng-reflect-disabled="false" ng-reflect-trigger="[object HTMLButtonElement]"></div><div class="mat-button-focus-overlay"></div></button>'
    }
    if ( plotType === 'both' || plotType === 'profile' ) {
      content = content + '<button id="' + row[0] + '_profile" color="primary" mat-raised-button="" class="mat-raised-button mat-button-base mat-primary" ng-reflect-color="primary"><span class="mat-button-wrapper">Profiles</span><div class="mat-button-ripple mat-ripple" matripple="" ng-reflect-centered="false" ng-reflect-disabled="false" ng-reflect-trigger="[object HTMLButtonElement]"></div><div class="mat-button-focus-overlay"></div></button>'
    }

    return content;
  }
}
