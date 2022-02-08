import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTableMenuComponent } from './file-table-menu.component';

describe('FileTableMenuComponent', () => {
  let component: FileTableMenuComponent;
  let fixture: ComponentFixture<FileTableMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileTableMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTableMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
