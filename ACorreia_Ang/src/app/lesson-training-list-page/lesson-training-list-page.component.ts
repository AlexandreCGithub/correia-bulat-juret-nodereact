import { Component } from '@angular/core';
import {LearningPackage} from "../created-interfaces";
import {LessonPackageService} from "../lessonpackageservice";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-lesson-training-list-page',
  templateUrl: './lesson-training-list-page.component.html',
  styleUrls: ['./lesson-training-list-page.component.css']
})
export class LessonTrainingListPageComponent {
  learningPackages : LearningPackage[] = [];
  selectedQuestionCount: number = 5;
  constructor(private LPservice: LessonPackageService) {}

  ngOnInit() {
    console.log('on init atteint');
    //Récupération des learning package
    this.LPservice.getLP().subscribe(
      (data) => {
        this.learningPackages = data;
        console.log(data);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des LP :', error);
      }
    );
  }


  //On détermine une couleur rgb en fct du coef_moyen
  getColor(coef_moyen:number) {
    const normalizedCoef = Math.min(100, Math.max(0, coef_moyen)) / 100;
    const red = Math.round(255 * (1 - normalizedCoef));
    const green = Math.round(255 * normalizedCoef);
    const blue = Math.round(255 * (1 - Math.abs(normalizedCoef - 0.5) * 2));
    return `rgb(${red}, ${green}, ${blue})`;
  }

}
