import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTableNavigationComponent } from './file-table-navigation.component';

describe('FileTableNavigationComponent', () => {
  let component: FileTableNavigationComponent;
  let fixture: ComponentFixture<FileTableNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileTableNavigationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTableNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
