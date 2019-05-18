import { TestBed } from '@angular/core/testing';

import { DashboardMaphiService } from './dashboard-maphi.service';

describe('DashboardMaphiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardMaphiService = TestBed.get(DashboardMaphiService);
    expect(service).toBeTruthy();
  });
});
