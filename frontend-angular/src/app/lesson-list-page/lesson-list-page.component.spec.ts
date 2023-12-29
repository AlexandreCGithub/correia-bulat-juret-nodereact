import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonListPageComponent } from './lesson-list-page.component';

describe('LessonListPageComponent', () => {
  let component: LessonListPageComponent;
  let fixture: ComponentFixture<LessonListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonListPageComponent]
    });
    fixture = TestBed.createComponent(LessonListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
