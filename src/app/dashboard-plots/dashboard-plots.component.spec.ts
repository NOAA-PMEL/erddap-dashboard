import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPlotsComponent } from './plots.component';

describe('PlotsComponent', () => {
  let component: DashboardPlotsComponent;
  let fixture: ComponentFixture<DashboardPlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
