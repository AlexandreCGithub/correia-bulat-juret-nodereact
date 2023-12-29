import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonDetailPageComponent } from './lesson-detail-page.component';

describe('LessonDetailPageComponent', () => {
  let component: LessonDetailPageComponent;
  let fixture: ComponentFixture<LessonDetailPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonDetailPageComponent]
    });
    fixture = TestBed.createComponent(LessonDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
