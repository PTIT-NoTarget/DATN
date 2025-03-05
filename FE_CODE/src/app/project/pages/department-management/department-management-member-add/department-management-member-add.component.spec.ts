import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagementMemberAddComponent } from './department-management-member-add.component';

describe('DepartmentManagementMemberAddComponent', () => {
  let component: DepartmentManagementMemberAddComponent;
  let fixture: ComponentFixture<DepartmentManagementMemberAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentManagementMemberAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentManagementMemberAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
