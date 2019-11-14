import {Component, Input, OnInit} from '@angular/core';
import {ErddapDataService} from '../erddap-data.service';

@Component({
  selector: 'app-platform-info',
  templateUrl: './platform-info.component.html',
  styleUrls: ['./platform-info.component.css']
})
export class PlatformInfoComponent implements OnInit {

  @Input() code;
  @Input() type;
  @Input() date;
  constructor(public erddapDataService: ErddapDataService) { }

  ngOnInit() {
  }
}
