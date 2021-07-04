import { TestBed } from '@angular/core/testing';

import { InViewService } from './in-view.service';

describe('InViewService', () => {
  let service: InViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
