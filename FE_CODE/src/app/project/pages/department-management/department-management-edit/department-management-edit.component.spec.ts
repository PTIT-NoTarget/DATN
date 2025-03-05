import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagementEditComponent } from './department-management-edit.component';

describe('DepartmentManagementEditComponent', () => {
  let component: DepartmentManagementEditComponent;
  let fixture: ComponentFixture<DepartmentManagementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentManagementEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentManagementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
