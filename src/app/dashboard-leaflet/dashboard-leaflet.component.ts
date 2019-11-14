import {Component, ElementRef, OnInit} from '@angular/core';
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
      mapState.message = undefined;
      erddapDataService.errorMessage = undefined;
      erddapDataService.getSurface(code, type);
      erddapDataService.getDepth(code, type);
    });
  }

  ngOnInit() {
    this.options = {
      zoom: 5,
      center: latLng(this.mapState.currentLat, this.mapState.currentLon)
    };
    this.layers.push(tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }));
  }
  onMapReady($event) {
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
            ).bindPopup(fl => this.makeMarkerPopup(row));
            newMarker.on('popupopen', function() {
              let b = document.getElementById(row[0]);
              b.addEventListener('click', (event: Event) => {
                let c_event = new CustomEvent("plot", {detail: {code: row[0], type: row[1]}, bubbles: true});
                b.dispatchEvent(c_event);
              });
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
  makeMarkerPopup(row: any) {
    const content ='<h1>Platform Code = ' + row[0] + '</h1>' +
      '<hr>' +
      '<h3>Platform Type = ' + row[1] + '</h3>' +
      '<h3>Most recent reporting time = ' + row[2] + '</h3>' +
      '<button id="' + row[0] + '" color="primary" mat-raised-button="" class="mat-raised-button mat-button-base mat-primary" ng-reflect-color="primary"><span class="mat-button-wrapper">See Plots</span><div class="mat-button-ripple mat-ripple" matripple="" ng-reflect-centered="false" ng-reflect-disabled="false" ng-reflect-trigger="[object HTMLButtonElement]"></div><div class="mat-button-focus-overlay"></div></button>'
    return content;
  }
}
