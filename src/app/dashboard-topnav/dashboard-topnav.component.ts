import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MapStateService } from '../map-state.service';
import {ErddapDataService} from '../erddap-data.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {HelpDialogComponent} from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-dashboard-topnav',
  templateUrl: './dashboard-topnav.component.html',
  styleUrls: ['./dashboard-topnav.component.css']
})
export class DashboardTopnavComponent implements OnInit {

  title = 'OCMC Dashboard';
  helpIsOpen = false;
  constructor(public mapState: MapStateService,
              public erddapDataService: ErddapDataService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    google.charts.load('current', {packages: ['corechart']});
    google.charts.load('current', {packages: ['annotationchart']});
  }
  onOpen() {
    const dialogConfig = new MatDialogConfig();
    this.matDialog.open(HelpDialogComponent, dialogConfig);
  }
}
