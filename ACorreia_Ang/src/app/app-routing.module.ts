import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LessonSearchPageComponent} from "./lesson-search-page/lesson-search-page.component";
import {LessonListPageComponent} from "./lesson-list-page/lesson-list-page.component";
import {LessonDetailPageComponent} from "./lesson-detail-page/lesson-detail-page.component";
import {HomePageComponent} from "./home-page/home-page.component";


const routes: Routes = [
  { path:'lesson-search',component: LessonSearchPageComponent },
  { path:'lesson-list-page',component: LessonListPageComponent },
  { path:'lesson-detail/:id',component: LessonDetailPageComponent },
  { path:'',component: HomePageComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
