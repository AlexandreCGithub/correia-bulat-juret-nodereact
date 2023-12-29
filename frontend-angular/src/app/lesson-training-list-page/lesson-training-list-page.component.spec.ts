import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonTrainingListPageComponent } from './lesson-training-list-page.component';

describe('LessonTrainingListPageComponent', () => {
  let component: LessonTrainingListPageComponent;
  let fixture: ComponentFixture<LessonTrainingListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonTrainingListPageComponent]
    });
    fixture = TestBed.createComponent(LessonTrainingListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
