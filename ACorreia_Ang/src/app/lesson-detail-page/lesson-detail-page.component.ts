import {Component, OnInit} from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import {LearningPackage, Question} from "../created-interfaces";
import {LessonPackageService} from "../lessonpackageservice";
import {QuestionService} from "../questionservice";

@Component({
  selector: 'app-lesson-detail-page',
  templateUrl: './lesson-detail-page.component.html',
  styleUrls: ['./lesson-detail-page.component.css']
})

export class LessonDetailPageComponent implements OnInit {
  Questions: Question[] = [];
  currentLearningPackage: LearningPackage| undefined;
  id_package: number | undefined;
  constructor(private activatedRoute: ActivatedRoute,
              private router : Router,
              private LPservice:LessonPackageService,
              private Qservice: QuestionService)
  {

  }
  ngOnInit()
  {
    this.activatedRoute.params.subscribe(params => {
      this.id_package = +params['id'];
      this.Qservice.getQuestionOfLP(this.id_package).subscribe(
        (data) => {
          this.Questions = data;
          console.log(data);
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la récupération des questions :', error);
        }
      );
      }
    );

    this.activatedRoute.params.subscribe(params => {
        this.id_package = +params['id'];
        this.LPservice.getLPwithid(this.id_package).subscribe(
          (data) => {
            this.currentLearningPackage = data;
            console.log(data);
          },
          (error) => {
            console.error('Une erreur s\'est produite lors de la récupération du learning package :', error);
          }
        );
      }
    );

  }

}


