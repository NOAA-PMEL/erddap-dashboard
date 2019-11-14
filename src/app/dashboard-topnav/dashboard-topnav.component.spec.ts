import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopnavComponent } from './dashboard-topnav.component';

describe('DashboardTopnavComponent', () => {
  let component: DashboardTopnavComponent;
  let fixture: ComponentFixture<DashboardTopnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTopnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
