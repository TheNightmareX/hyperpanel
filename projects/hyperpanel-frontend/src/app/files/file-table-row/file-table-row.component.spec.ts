import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTableRowComponent } from './file-table-row.component';

describe('FileTableRowComponent', () => {
  let component: FileTableRowComponent;
  let fixture: ComponentFixture<FileTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileTableRowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
