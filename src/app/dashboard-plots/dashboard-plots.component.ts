import {Component, HostListener, OnInit} from '@angular/core';
import {MapStateService} from '../map-state.service';
import {ErddapDataService} from '../erddap-data.service';

@Component({
  selector: 'app-dashboard-plots',
  templateUrl: './dashboard-plots.component.html',
  styleUrls: ['./dashboard-plots.component.css']
})
export class DashboardPlotsComponent implements OnInit {
  dynamicResize = true;
  graph;
  constructor(public mapState: MapStateService,
              public erddapDataService: ErddapDataService) {
  }

  ngOnInit() {

  }

}
