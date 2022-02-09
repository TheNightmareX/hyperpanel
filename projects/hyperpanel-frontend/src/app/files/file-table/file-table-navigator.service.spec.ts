import { TestBed } from '@angular/core/testing';

import { FileTableNavigator } from './file-table-navigator.service';

describe('FileTableNavigator', () => {
  let service: FileTableNavigator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileTableNavigator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
