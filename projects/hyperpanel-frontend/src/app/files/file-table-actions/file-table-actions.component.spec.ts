import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTableActionsComponent } from './file-table-actions.component';

describe('FileTableActionsComponent', () => {
  let component: FileTableActionsComponent;
  let fixture: ComponentFixture<FileTableActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileTableActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTableActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
