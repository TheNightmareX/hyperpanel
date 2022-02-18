import { TestBed } from '@angular/core/testing';

import { FileTableSorter } from './file-table-sorter.service';

describe('FileTableSorter', () => {
  let service: FileTableSorter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileTableSorter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
