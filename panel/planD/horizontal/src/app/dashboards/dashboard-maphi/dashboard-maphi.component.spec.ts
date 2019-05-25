import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMaphiComponent } from './dashboard-maphi.component';

describe('DashboardMaphiComponent', () => {
  let component: DashboardMaphiComponent;
  let fixture: ComponentFixture<DashboardMaphiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMaphiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMaphiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
