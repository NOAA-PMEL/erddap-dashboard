import { Component, OnInit } from '@angular/core';
import {ErddapDataService} from '../erddap-data.service';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.css']
})
export class DashboardProfileComponent implements OnInit {

  constructor(private erddapDataService: ErddapDataService) { }

  ngOnInit() {
  }

}
