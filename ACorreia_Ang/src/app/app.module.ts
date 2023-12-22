import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuNavBarComponent } from './menu-nav-bar/menu-nav-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LessonListPageComponent } from './lesson-list-page/lesson-list-page.component';
import { LessonDetailPageComponent } from './lesson-detail-page/lesson-detail-page.component';
import {HttpClientModule} from "@angular/common/http";
import { HomePageComponent } from './home-page/home-page.component';
import { LessonTrainingListPageComponent } from './lesson-training-list-page/lesson-training-list-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuNavBarComponent,
    LessonListPageComponent,
    LessonDetailPageComponent,
    HomePageComponent,
    LessonTrainingListPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
