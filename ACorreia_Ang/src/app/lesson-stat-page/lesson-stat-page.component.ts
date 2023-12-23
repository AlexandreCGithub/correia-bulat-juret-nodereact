import { Component } from '@angular/core';
import {Element_Historique, Question} from "../created-interfaces";
import {ActivatedRoute, Router} from "@angular/router";
import {LessonPackageService} from "../lessonpackageservice";
import {QuestionService} from "../questionservice";
import {StatService} from "../statservice";

@Component({
  selector: 'app-lesson-stat-page',
  templateUrl: './lesson-stat-page.component.html',
  styleUrls: ['./lesson-stat-page.component.css']
})
export class LessonStatPageComponent {
  histo: Element_Historique[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private router : Router,
              private LPservice:LessonPackageService,
              private Qservice: QuestionService,
              private Sservice: StatService
              ){}

  ngOnInit() {
        this.Sservice.getAllHistorique().subscribe(
          (data) => {
            this.histo = data;
            console.log(data);
          },
          (error) => {
            console.error('Une erreur s\'est produite lors de la récupération de l historique :', error);
          }
        );
  }


}
