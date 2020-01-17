import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppConfigService} from './app-config.service';
import {ErddapJson} from './erddap-json';
import * as everpolate from 'everpolate';
import {DatePipe} from '@angular/common';
import {forEachToken} from 'tslint';

@Injectable({
  providedIn: 'root'
})
export class ErddapDataService {

  // Manage the width of the plots
  innerWidth: number = 640;
  innerHeight: number = 480;
  number_cols: any;
  plot_count: number = 2;
  number_surf_cols: number = 1;

  map_columns = 4;
  plot_columns = 8;

  bigNegative: number = -99999;
  bigPositive: number = 99999;
  duplicate_time = false;
  platformCode = undefined;
  platformType = undefined;
  plots;
  plotTitle;
  showProgressSurface = false;
  showProgressProfiles = false;
  surfacePlots = false;
  profilePlots = false;
  anyDataLoaded = false;
  csv;
  netcdf;
  dataUrl = '/erddap/tabledap/30day_subset.dataTable?time%2C';
  depthUrl = '/erddap/tabledap/30day_subset.dataTable?';
  depthConstrained;
  constrained;
  has;
  depthData: ErddapJson;
  plotVar;
  errorMessage;
  dataTable: google.visualization.DataTable;
  sstView: number[] = [0];
  atmpView: number[] = [0];
  precipView: number[] = [0];
  slpView: number[] = [0];
  windspdView: number[] = [0];
  winddirView: number[] = [0];
  wvhtView: number[] = [0];
  cloudsView: number[] = [0];
  dewpointView: number[] = [0];
  waterlevel_met_resView: number[] = [0];
  waterlevel_wrt_lcdView: number[] = [0];
  water_col_htView: number[] = [0];
  ztmpView: number[] = [0];
  zsalView: number[]  = [0];
  sstChartData;
  atmpChartData;
  precipChartData;
  ztmpChartData;
  zsalChartData;
  slpChartData;
  windspdChartData;
  winddirChartData;
  wvhtChartData;
  cloudsChartData;
  dewpointChartData;
  waterlevel_met_resChartData;
  waterlevel_wrt_lcdChartData;
  water_col_htChartData;
  vars;
  tmpPlotType = 'heatmap';
  get_ztmp: boolean = false;
  ztmp_col: number = 0;
  zsal_col: number = 0;
  get_zsal: boolean = false;
  get_surf: boolean = false;
  timeConstraint = '';
  linear = everpolate.linear;
  dive_count: number = 1;
  constructor(private httpClient: HttpClient, private  appConfig: AppConfigService, private datePipe: DatePipe) {
    this.vars = new Map();
    this.has = new Map();
    this.vars.set('AUTONOMOUS PINNIPEDS', ['ztmp']);
    this.vars.set('C-MAN WEATHER STATIONS', ['sst', 'atmp', 'slp', 'windspd', 'winddir']);
    this.vars.set('CLIMATE REFERENCE MOORED BUOYS', ['ztmp', 'zsal']);
    this.vars.set('DRIFTING BUOYS (GENERIC)', ['sst', 'slp']);
    this.vars.set('GLIDERS', ['ztmp', 'zsal']);
    this.vars.set('MOORED BUOYS (GENERIC)', ['sst', 'atmp', 'slp', 'windspd', 'winddir', 'wvht', 'dewpoint']);
    this.vars.set('OCEAN TRANSPORT STATIONS (GENERIC)', ['ztmp', 'zsal']);
    this.vars.set('PROFILING FLOATS AND GLIDERS (GENERIC)', ['ztmp', 'zsal']);
    this.vars.set('RESEARCH', ['sst', 'atmp', 'slp', 'windspd', 'winddir', 'dewpoint']);
    this.vars.set('SHIPS (GENERIC)', ['sst', 'atmp', 'slp', 'windspd', 'winddir', 'clouds', 'dewpoint']);
    this.vars.set('SHORE AND BOTTOM STATIONS (GENERIC)', ['sst', 'atmp', 'precip', 'ztmp', 'zsal', 'slp', 'windspd', 'winddir', 'clouds', 'dewpoint']);
    this.vars.set('TIDE GAUGE STATIONS (GENERIC)', ['sst', 'atmp', 'slp', 'windspd', 'winddir', 'dewpoint']);
    this.vars.set('TROPICAL MOORED BUOYS', ['sst', 'atmp', 'windspd', 'winddir', 'ztmp', 'zsal']);
    this.vars.set('TSUNAMI WARNING STATIONS', ['water_col_ht']);
    this.vars.set('UNKNOWN', ['waterlevel_met_res', 'waterlevel_wrt_lcd']);
    this.vars.set('VOLUNTEER OBSERVING SHIPS', ['sst', 'atmp', 'slp',  'windspd', 'winddir', 'clouds', 'dewpoint']);
    this.vars.set('VOLUNTEER OBSERVING SHIPS (GENERIC)', ['sst', 'atmp', 'slp',  'windspd', 'winddir', 'wvht', 'clouds', 'dewpoint']);
    this.vars.set('VOSCLIM', ['waterlevel_met_res', 'waterlevel_wrt_lcd']);
    this.vars.set('WEATHER AND OCEAN OBS', ['sst', 'atmp', 'slp', 'windspd', 'winddir', 'wvht', 'dewpoint']);
    this.vars.set('WEATHER BUOYS', ['sst', 'atmp', 'slp', 'windspd', 'winddir', 'wvht', 'dewpoint']);
    this.vars.set('WEATHER OBS', ['atmp', 'slp', 'windspd', 'winddir']);
    this.has.set('sst', false);
    this.has.set('atmp', false);
    this.has.set('precip', false);
    this.has.set('ztmp', false);
    this.has.set('zsal', false);
    this.has.set('slp', false);
    this.has.set('windspd', false);
    this.has.set('winddir', false);
    this.has.set('wvht', false);
    this.has.set('clouds', false);
    this.has.set('dewpoint', false);
    this.has.set('waterlevel_met_res', false);
    this.has.set('waterlevel_wrt_lcd', false);
    this.has.set('water_col_ht', false);
    this.dataUrl = appConfig.getTimeseriesBase();
    this.depthUrl = appConfig.getDepthParameterBase();
    this.timeConstraint = appConfig.getTimeConstraint();
  }
  hasData(dataTable: google.visualization.DataTable, view: number[]): boolean {
    const range = dataTable.getColumnRange(view[1]);
    if ( range.min || range.max ) {
      if ( range.min === range.max ) {
        return false;
      }
      return true;
    }
    return false;
  }
  anyData() {
    let b:boolean = true;
    this.has.forEach((value: boolean, key: string) => {
      if ( value ) {
        b = b && value;
      }
    });
    return b;
  }
  getSurface(platformCode, platformType) {
    this.profilePlots = false;
    this.surfacePlots = true;
    this.anyDataLoaded = false;
    this.platformCode = platformCode;
    this.platformType = platformType;
    for ( const key of this.has.keys() ) {
      this.has.set(key, false);
    }
    this.plots = this.vars.get(platformType);
    this.plotTitle = this.platformCode + '-' + this.platformType;
    this.showProgressSurface = true;
    console.log('Setting platform code to ' + platformCode);
    if (!this.platformCode) {
      return;
    }
    let erddapVarsList = '';
    let index = 1;
    this.sstView = [0];
    this.atmpView = [0];
    this.slpView = [0];
    this.windspdView = [0];
    this.winddirView = [0];
    this.wvhtView = [0];
    this.dewpointView = [0];
    this.cloudsView = [0];
    this.water_col_htView = [0];
    this.precipView = [0];
    this.waterlevel_met_resView = [0];
    this.waterlevel_wrt_lcdView = [0];
    this.zsalView = [0];
    this.ztmpView = [0];
    this.get_zsal = false;
    this.get_ztmp = false;
    this.get_surf = false;
    this.plot_count = 0;
    this.plots.forEach(aPlotVar => {
        if ( aPlotVar === 'sst' ) {
          this.sstView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'atmp') {
          this.atmpView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'slp') {
          this.slpView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'windspd') {
          this.windspdView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'winddir') {
          this.winddirView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'wvht') {
          this.wvhtView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'dewpoint') {
          this.dewpointView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'clouds') {
          this.cloudsView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'water_col_ht') {
          this.water_col_htView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'precip') {
          this.precipView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'waterlevel_met_res') {
          this.waterlevel_met_resView.push(index);
          this.get_surf = true;
        }
        if (aPlotVar === 'waterlevel_wrt_lcd') {
          this.waterlevel_wrt_lcdView.push(index);
          this.get_surf = true;
        }
        if ( aPlotVar !== 'ztmp' && aPlotVar !== 'zsal' ) {
          if (index > 1) {
            erddapVarsList = erddapVarsList + '%2C';
          }
          erddapVarsList = erddapVarsList + aPlotVar;
          index++;
        }
      }
    );
    let constraint = this.timeConstraint;
    if ( platformType === 'TROPICAL MOORED BUOYS') {
      constraint = constraint + "&observation_depth=0";
    }
    this.constrained = this.dataUrl + erddapVarsList + '&platform_code="' + this.platformCode + '"&orderBy("time")' + constraint;
    if ( this.get_surf ) {
      this.csv = this.constrained.replace("dataTable", "csv");
      this.netcdf = this.constrained.replace("dataTable", "ncCF")
      console.log('Requesting ' + this.constrained);
      return this.httpClient.get<string>(this.constrained).subscribe(value => {
        this.dataTable = new google.visualization.DataTable(value);
        const myDaterange = this.datePipe.transform(this.dataTable.getValue(0,0), 'yyyy-MM-dd', 'UTC') + ' to ' +
                            this.datePipe.transform(this.dataTable.getValue(this.dataTable.getNumberOfRows() - 1, 0), 'yyyy-MM-dd', 'UTC');
        this.plots.forEach(aPlotVar => {
            if (aPlotVar === 'sst') {
              const myTitle = this.dataTable.getColumnLabel(this.sstView[1]) + ' -- ' + this.plotTitle;
              this.sstChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.sstView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.sstView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'atmp') {
              const myTitle = this.dataTable.getColumnLabel(this.atmpView[1]) + ' -- ' + this.plotTitle;
              this.atmpChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.atmpView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.atmpView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'slp') {
              const myTitle = this.dataTable.getColumnLabel(this.slpView[1]) + ' -- ' + this.plotTitle;
              this.slpChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.slpView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.slpView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'windspd') {
              const myTitle = this.dataTable.getColumnLabel(this.windspdView[1]) + ' -- ' + this.plotTitle;
              this.windspdChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.windspdView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.windspdView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'winddir') {
              const myTitle = this.dataTable.getColumnLabel(this.winddirView[1]) + ' -- ' + this.plotTitle;
              this.winddirChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.winddirView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.winddirView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'wvht') {
              const myTitle = this.dataTable.getColumnLabel(this.wvhtView[1]) + ' -- ' + this.plotTitle;
              this.wvhtChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.wvhtView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.wvhtView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'dewpoint') {
              const myTitle = this.dataTable.getColumnLabel(this.dewpointView[1]) + ' -- ' + this.plotTitle;
              this.dewpointChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.dewpointView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.dewpointView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'clouds') {
              const myTitle = this.dataTable.getColumnLabel(this.cloudsView[1]) + ' -- ' + this.plotTitle;
              this.cloudsChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.cloudsView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.cloudsView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'water_col_ht') {
              const myTitle = this.dataTable.getColumnLabel(this.water_col_htView[1]) + ' -- ' + this.plotTitle;
              this.water_col_htChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.water_col_htView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.water_col_htView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'precip') {
              const myTitle = this.dataTable.getColumnLabel(this.precipView[1]) + ' -- ' + this.plotTitle;
              this.precipChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.precipView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.precipView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'waterlevel_met_res') {
              const myTitle = this.dataTable.getColumnLabel(this.waterlevel_met_resView[1]) + ' -- ' + this.plotTitle;
              this.waterlevel_met_resChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.waterlevel_met_resView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.waterlevel_met_resView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            } else if (aPlotVar === 'waterlevel_wrt_lcd') {
              const myTitle = this.dataTable.getColumnLabel(this.waterlevel_wrt_lcdView[1]) + ' -- ' + this.plotTitle;
              this.waterlevel_wrt_lcdChartData = {
                chartType: 'LineChart',
                dataTable: this.dataTable,
                view: {columns: this.waterlevel_wrt_lcdView},
                options: {
                  title: myTitle,
                  legend: {position: 'none'},
                  explorer: {
                    axis: 'horizontal'
                  },
                  hAxis: {textPosition: 'none', title: myDaterange},
                  // chartArea:{left:20, right: 20}
                }
              };
              if (this.hasData(this.dataTable, this.waterlevel_wrt_lcdView)) {
                this.has.set(aPlotVar, true);
                this.plot_count++;
              }
            }
          }
        );
        if ( this.plot_count > 4 ) {
          this.number_surf_cols = 2;
        } else {
          this.number_surf_cols = 1;
        }
        this.anyDataLoaded = this.anyData();
        this.showProgressSurface = false;
      }, error => {
        this.showProgressSurface = false;
        this.errorMessage = 'An error occurred getting the data for the surface timeseries plots.';
      });
    }
    if ( this.get_zsal && this.get_ztmp ) {
      this.depthConstrained = this.depthUrl + 'observation_depth%2Czsal%2Cztmp%2Ctime&platform_code="' + this.platformCode + '"&orderBy("time,observation_depth")' + this.timeConstraint;
      this.zsalView.push(1);
      this.ztmpView.push(2);
      this.zsal_col = 1;
      this.ztmp_col = 2;
    } else if ( this.get_zsal && !this.get_ztmp ) {
      this.depthConstrained = this.depthUrl + 'observation_depth%2Cztmp%2Ctime&platform_code="' + this.platformCode + '"&orderBy("time,observastion_depth")' + this.timeConstraint;
      this.zsalView.push(1);
      this.zsal_col = 1;
    } else if ( !this.get_zsal && this.get_ztmp ) {
      this.depthConstrained = this.depthUrl + 'observastion_depth%2Czsal%2Ctime&platform_code="' + this.platformCode + '"&orderBy("time,observastion_depth")' + this.timeConstraint;
      this.ztmpView.push(1);
      this.ztmp_col = 1;
    }
  }
  getDepth(platformCode, platformType) {
    this.surfacePlots = false;
    this.profilePlots = true;
    this.platformCode = platformCode;
    this.platformType = platformType;
    this.dive_count = 1;
    for ( const key of this.has.keys() ) {
      this.has.set(key, false);
    }
    this.plots = this.vars.get(platformType);
    this.plotTitle = this.platformCode + '-' + this.platformType;
    this.showProgressProfiles = true;
    console.log('Setting platform code to ' + platformCode);
    if (!this.platformCode) {
      return;
    }
    let index = 1;
    this.get_zsal = false;
    this.get_ztmp = false;
    this.get_surf = false;
    this.plots.forEach(aPlotVar => {
        if ( aPlotVar === 'ztmp' ) {
          this.get_ztmp = true;
        }
        if ( aPlotVar === 'zsal' ) {
          this.get_zsal = true;
        }
        index++;
      }
    );

    if ( this.get_zsal && this.get_ztmp ) {
      this.depthConstrained = this.depthUrl + 'observation_depth%2Czsal%2Cztmp%2Ctime%2Clatitude%2Clongitude&platform_code="' + this.platformCode + '"&orderBy("time,latitude,longitude,observation_depth")&observation_depth>0' + this.timeConstraint;
      this.zsalView.push(1);
      this.ztmpView.push(2);
      this.zsal_col = 1;
      this.ztmp_col = 2;
    } else if ( this.get_zsal && !this.get_ztmp ) {
      this.depthConstrained = this.depthUrl + 'observation_depth%2Cztmp%2Ctime%2Clatitude%2Clongitude&platform_code="' + this.platformCode + '"&orderBy("time,latitude,longitude,observastion_depth")' + this.timeConstraint;
      this.zsalView.push(1);
      this.zsal_col = 1;
    } else if ( !this.get_zsal && this.get_ztmp ) {
      this.depthConstrained = this.depthUrl + 'observastion_depth%2Czsal%2Ctime%2Clatitude%2Clongitude&platform_code="' + this.platformCode + '"&orderBy("time,latitude,longitude,observastion_depth")&observation_depth>0' + this.timeConstraint;
      this.ztmpView.push(1);
      this.ztmp_col = 1;
    }
    this.csv = this.depthConstrained.replace("json","csv");
    this.netcdf = this.depthConstrained.replace("json", "ncCF");
    if ( this.get_ztmp || this.get_zsal ) {
      console.log('Fetching ' + this.depthConstrained);
      return this.httpClient.get<ErddapJson>(this.depthConstrained).subscribe(value => {
        this.depthData = value;
        let x: any[] = [];
        let ysal: any[] = [];
        let ytmp: any[] = []
        let yreference: any[] = [];
        let sal: any[] = [];
        let tmp: any[] = [];
        let current_depth = this.bigNegative;
        let previous_depth = this.bigNegative;
        let current_time;
        // let yindex = 0;
        let sal_rowsize = 0;
        let tmp_rowsize = 0;
        let depth_index = 0;
        let max_depth = this.bigNegative;
        let min_depth = this.bigPositive;
        let zsal_hold:number[] = [];
        let ztmp_hold:number[] = [];
        // Find the max depth and check for duplicate time values.
        for (let i = 0; i < this.depthData.table.rows.length; i++) {
          let rowvalues = this.depthData.table.rows[i];
          let depth = rowvalues[0];
          if (depth > max_depth) {
            max_depth = depth;
          }
          if (depth < min_depth) {
            min_depth = depth;
          }
        }
        let depth_delta = max_depth / 250;
        let grid_depth = min_depth;
        while (grid_depth <= max_depth) {
          yreference.push(grid_depth);
          grid_depth = grid_depth + depth_delta;
        }
        for (let i = 0; i < this.depthData.table.rows.length; i++) {
          let rowvalues = this.depthData.table.rows[i];
          current_depth = rowvalues[0];
          current_time = rowvalues[3];
          if (previous_depth === this.bigNegative) {
            // Start of a new dive
            let new_time = rowvalues[3];
            if (!x.includes(new_time)) {
              x.push('Profile at ' + rowvalues[3]);
              this.duplicate_time = false;
            } else {
              this.duplicate_time = true;
            }
          }
          depth_index++;
          if (!this.duplicate_time) {
            if (previous_depth - current_depth > 200) { // We've reached the bottom of the dive and are ready to start a new one

              if (this.get_zsal) {
                this.save_dive(sal, zsal_hold, ysal, yreference);
              }
              if (this.get_ztmp) {
                this.save_dive(tmp, ztmp_hold, ytmp, yreference)
              }

              this.dive_count++;
              previous_depth = this.bigNegative;
              depth_index = 0;
              x.push('Profile at ' + current_time);
              ysal = [];
              ytmp = [];
              ztmp_hold = [];
              zsal_hold = [];
            }

            if (rowvalues[this.zsal_col] !== null && rowvalues[this.zsal_col] > .0001) {
              ysal.push(current_depth);
              zsal_hold.push(rowvalues[this.zsal_col]);
            }

            if ( rowvalues[this.ztmp_col] !== null ) {
              ytmp.push(current_depth);
              ztmp_hold.push(rowvalues[this.ztmp_col]);
            }

            previous_depth = current_depth;

          }
        }

        // Save the last dive (which in the case of only 1 dive is the first (and only) dive)
        if (this.get_zsal) {
          this.save_dive(sal, zsal_hold, ysal, yreference);
        }
        if (this.get_ztmp) {
          this.save_dive(tmp, ztmp_hold, ytmp, yreference)
        }

        console.log('Dive Count is ' + this.dive_count );

        let yref_sal = yreference;
        this.clean(yref_sal, sal, null);
        let yref_tmp = yreference;
        this.clean(yref_tmp, tmp, null);

        if ( sal.length > 0 ) {
          this.has.set('zsal', this.get_zsal);
          this.plot_count = this.plot_count + 2;
        }
        if ( tmp.length > 0 ) {
          this.has.set('ztmp', this.get_ztmp);
          // This count double since they are always on their own line TODO for now
          this.plot_count = this.plot_count + 2;
        }
        let ticks = this.dive_count;
        if ( ticks > 10 ) ticks = 10;

        let profile_based_width = (this.dive_count * 25) + 450;
        const half = this.innerWidth / 2;
        if ( profile_based_width >  half ) {
          this.number_cols = 1;
          profile_based_width = Math.min(this.innerWidth, profile_based_width)
        } else {
          this.number_cols = 2;
        }

        if ( this.dive_count === 1) {
          this.tmpPlotType = 'heatmap';
        } else {
          this.tmpPlotType = 'heatmap'
        }
        let myDaterange = this.datePipe.transform(x[0].replace('Profile at ', ''), 'yyyy-MM-dd', 'UTC');
        if ( this.dive_count > 1 ) {
          myDaterange = myDaterange + ' to ' + this.datePipe.transform(x[x.length-1].replace('Profile at ', ''),  'yyyy-MM-dd', 'UTC');
        }
        const zsal_title = this.plotTitle + ' <br>depth vs zsal';
        this.zsalChartData = {
          data: [
            { x: x, y: yref_sal, z: sal,
              type: this.tmpPlotType,
              xgap: 2
            },
          ],
          layout: {
            autosize: true,
            width: profile_based_width,
            height: this.depthPlotHeight(),
            title: zsal_title,
            yaxis: {automargin: true, autorange: 'reversed'},
            xaxis: {
              ticks: '',
              showticklabels: false,
              title: {
                text: myDaterange
              }
            }
          }
        };

        const ztmp_title =  this.plotTitle + '<br>depth vs ztmp';
        this.ztmpChartData  = {
          data: [
            { x: x, y: yref_tmp, z: tmp,
              type: this.tmpPlotType,
              xgap: 2
            },
          ],
          layout: {
            autosize: true,
            width: profile_based_width,
            height: this.depthPlotHeight(),
            title: ztmp_title,
            yaxis: {automargin: true, autorange: 'reversed'},
            xaxis: {
              ticks: '',
              showticklabels: false,
              title: {
                text: myDaterange}
            }
          }
        };

        this.showProgressProfiles = false;
      }, error => {
        this.showProgressProfiles = false;
        this.errorMessage = 'An error occurred getting the data for the depth plots.';
      });
    }
  }
  save_dive(final2D: any[][], currentDive: any[], currentY: any[], referenceY: any[]) {
    // Interpolate and push the current dive onto the 2D arrays
    let dive_interp:number[] = [];
    if ( currentY.length > 2 ) {
      // If there a few values, interpolate. If not make the column null
      dive_interp = this.linear(referenceY, currentY, currentDive);
    } else {
      for (let j = 0; j < referenceY.length; j++) {
        dive_interp.push(null);
      }
    }
    for (let j = 0; j < dive_interp.length; j++) {
      if (this.dive_count === 1) {
        let salrow: any[] = [];
        if (referenceY[j] <= currentY[currentY.length - 1] && referenceY[j] >= currentY[0]) {
          salrow.push(dive_interp[j]);
        } else {
          salrow.push(null)
        }
        final2D.push(salrow);
      } else {
        let salrow = final2D[j];
        if (referenceY[j] <= currentY[currentY.length - 1] && referenceY[j] >= currentY[0]) {
          salrow.push(dive_interp[j]);
        } else {
          salrow.push(null)
        }
      }
    }
  }
  clean(y: any[], f: any[][], v: any) {
    // Start at the bottom and find the first non-blank row
    let startrm = y.length;
    for (let i = y.length - 1; i >= 0; i--) {
      let row = f[i];
      let remove = row.every(element => element === v)
      if ( remove ) {
        startrm = i;
      }
    }
    if ( startrm < y.length ) {
      let countrm = y.length - startrm;
      f.splice(startrm, countrm);
      y.splice(startrm, countrm);
    }
  }
  mapWidth() {
    const mw = (this.innerWidth*(this.map_columns/12)) - 10;
    return mw+'px';
  }
  totalPlotsWidth() {
    const pw = (this.innerWidth*(this.plot_columns/12)) - 10;
    return pw + 'px';
  }
  plotWidth() {
    let num_plot_col = 2;
    if ( this.plot_count <= 4 ) {
      num_plot_col = 1;
    }
    const ncols = this.plot_columns / num_plot_col;
    const pw = (this.innerWidth * (ncols / 12) - 25);
    return pw+'px';
  }
  mapHeight() {
    const mh = this.rowHeight()-110;  // Height of the header (75)  plus a little bit
    return mh+'px';
  }
  plotHeight(){
    let ph;
    if ( this.plot_count > 4 ) {
      ph = this.innerHeight/((this.plot_count/2)+1) - 20;
    } else if (this.plot_count > 2 && this.plot_count <= 4 ) {
      ph = this.innerHeight/this.plot_count - 20;
    } else {
      ph = this.innerHeight/2 - 20;
    }
    return ph+'px';
  }
  depthPlotHeight() {
    const ph = this.innerHeight/((this.plot_count/2)+1) - 400;
    return ph+'px';
  }
  mapStyles() {
    const s = {
      'width':this.mapWidth(),
      'height':this.mapHeight(),
      'margin-bottom':'20px'
    };
    return s;
  }
  plotStyles() {
    const s = {
      'width': this.plotWidth(),
      'height': this.plotHeight()
    }
    return s;
  }
  ngPlotWidth() {
    const s = {
      'width': this.totalPlotsWidth(),
    }
    return s;
  }
  rowHeight() {
    const rh = this.innerHeight - 20;
    return rh;
  }
  outerDiv() {
    const s = {
      'height':this.rowHeight() - 75,
      'width':this.totalPlotsWidth()
    }
    return s;
  }
}
