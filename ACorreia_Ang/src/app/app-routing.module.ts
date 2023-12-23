import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LessonListPageComponent} from "./lesson-list-page/lesson-list-page.component";
import {LessonDetailPageComponent} from "./lesson-detail-page/lesson-detail-page.component";
import {LessonTrainingListPageComponent} from "./lesson-training-list-page/lesson-training-list-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {LessonTrainingPageComponent} from "./lesson-training-page/lesson-training-page.component";
import {LessonStatPageComponent} from "./lesson-stat-page/lesson-stat-page.component";

const routes: Routes = [
  { path:'lesson-management-list-page',component: LessonListPageComponent },
  { path:'lesson-training-list-page',component: LessonTrainingListPageComponent },
  { path:'lesson-detail/:id',component: LessonDetailPageComponent },
  { path:'lesson-training-page/:id/:q',component: LessonTrainingPageComponent },
  { path:'lesson-stat-page',component: LessonStatPageComponent },
  { path:'',component: HomePageComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
