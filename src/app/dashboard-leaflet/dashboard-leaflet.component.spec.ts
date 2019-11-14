import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLeafletComponent } from './dashboard-leaflet.component';

describe('DashboardLeafletComponent', () => {
  let component: DashboardLeafletComponent;
  let fixture: ComponentFixture<DashboardLeafletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLeafletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLeafletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
