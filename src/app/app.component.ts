import { Component } from '@angular/core';
import {MapStateService} from './map-state.service';
import {ErddapDataService} from './erddap-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OSMC Dashboard';
}
