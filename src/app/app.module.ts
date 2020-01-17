import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { PlotlyModule } from 'angular-plotly.js';
import { GoogleChartsModule } from 'angular-google-charts';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule, MatDialogModule, MatExpansionModule, MatProgressSpinnerModule} from '@angular/material';
import {MatProgressBarModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material';

import {DashboardTopnavComponent} from './dashboard-topnav/dashboard-topnav.component';
import {DashboardPlotsComponent} from './dashboard-plots/dashboard-plots.component';
import {DashboardLeafletComponent} from './dashboard-leaflet/dashboard-leaflet.component';
import {HelpDialogComponent} from './help-dialog/help-dialog.component';
import {MapStateService} from './map-state.service';
import {ErddapDataService} from './erddap-data.service';
import {AppConfigService} from './app-config.service';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import {DatePipe} from '@angular/common';
import { DashboardProfileComponent } from './dashboard-profile/dashboard-profile.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    DashboardPlotsComponent,
    DashboardLeafletComponent,
    DashboardTopnavComponent,
    HelpDialogComponent,
    DashboardLayoutComponent,
    DashboardProfileComponent
  ],
  entryComponents: [HelpDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PlotlyModule,
    GoogleChartsModule.forRoot(),
    LeafletModule.forRoot(),
    HttpClientModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  providers: [MapStateService, ErddapDataService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          // Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      }
    }, DatePipe],
  bootstrap:  [AppComponent]
})
export class AppModule { }
