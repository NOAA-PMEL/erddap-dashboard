import { TestBed } from '@angular/core/testing';

import { ErddapDataService } from './erddap-data.service';

describe('ErddapDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErddapDataService = TestBed.get(ErddapDataService);
    expect(service).toBeTruthy();
  });
});
