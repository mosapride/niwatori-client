import { TestBed } from '@angular/core/testing';

import { IntervalTaskRunnerService } from './interval-task-runner.service';

describe('IntervalTaskRunnerService', () => {
  let service: IntervalTaskRunnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervalTaskRunnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
