import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTableNavigatorComponent } from './file-table-navigator.component';

describe('FileTableNavigatorComponent', () => {
  let component: FileTableNavigatorComponent;
  let fixture: ComponentFixture<FileTableNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileTableNavigatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTableNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
