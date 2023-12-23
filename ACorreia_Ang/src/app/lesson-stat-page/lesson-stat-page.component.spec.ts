import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonStatPageComponent } from './lesson-stat-page.component';

describe('LessonStatPageComponent', () => {
  let component: LessonStatPageComponent;
  let fixture: ComponentFixture<LessonStatPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonStatPageComponent]
    });
    fixture = TestBed.createComponent(LessonStatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
