import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonSearchPageComponent } from './lesson-search-page.component';

describe('LessonSearchPageComponent', () => {
  let component: LessonSearchPageComponent;
  let fixture: ComponentFixture<LessonSearchPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonSearchPageComponent]
    });
    fixture = TestBed.createComponent(LessonSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
