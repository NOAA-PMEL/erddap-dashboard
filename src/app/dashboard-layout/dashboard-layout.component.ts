import {Component, HostListener, OnInit} from '@angular/core';
import {ErddapDataService} from '../erddap-data.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {

  constructor(private erddapDataService: ErddapDataService) { }
  ngOnInit() {
  }

}
