import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonTrainingPageComponent } from './lesson-training-page.component';

describe('LessonTrainingPageComponent', () => {
  let component: LessonTrainingPageComponent;
  let fixture: ComponentFixture<LessonTrainingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonTrainingPageComponent]
    });
    fixture = TestBed.createComponent(LessonTrainingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
