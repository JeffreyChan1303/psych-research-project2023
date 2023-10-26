import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDataEntryTaskComponent } from './medical-data-entry-task.component';

describe('MedicalDataEntryTaskComponent', () => {
  let component: MedicalDataEntryTaskComponent;
  let fixture: ComponentFixture<MedicalDataEntryTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalDataEntryTaskComponent]
    });
    fixture = TestBed.createComponent(MedicalDataEntryTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
