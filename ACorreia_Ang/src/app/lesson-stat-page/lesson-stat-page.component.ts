import { Component } from '@angular/core';
import {Element_Historique, LearningPackage} from "../created-interfaces";
import {StatService} from "../statservice";
import {ActivatedRoute, Router} from "@angular/router";
import {LessonPackageService} from "../lessonpackageservice";

@Component({
  selector: 'app-lesson-stat-page',
  templateUrl: './lesson-stat-page.component.html',
  styleUrls: ['./lesson-stat-page.component.css']
})
export class LessonStatPageComponent {
  histo :Element_Historique[] = [];
  id_package:number = -1;
  currentLearningPackage: LearningPackage | null = null;

  constructor(private Sservice: StatService,
              private activatedRoute: ActivatedRoute,
              private LPservice: LessonPackageService,
              private router: Router) {}

  ngOnInit() {
    console.log('on init atteint');
    this.activatedRoute.params.subscribe(params => {
      this.id_package = +params['id'];
      this.Sservice.getHistorique(this.id_package).subscribe(
        (data) => {
          this.histo = data;
          console.log(data);
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la récupération de l historique :', error);
        }
      );
    });

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
  formatDateTime(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
  }

  getColor(diff:number): string {
    if (diff > 0) {
      return 'green'; // Si le coefficient augmente, couleur verte
    } else if (diff <0) {
      return 'red'; // Si le coefficient régresse, couleur rouge
    } else {
      return 'orange'; // Si le coefficient stagne, couleur orange
    }
  }

  getString(coefAvant: number, coefApres: number): string {
    if (coefAvant < coefApres) {
      return 'Progression'; // Si le coefficient augmente, couleur verte
    } else if (coefAvant > coefApres) {
      return 'Régression'; // Si le coefficient régresse, couleur rouge
    } else {
      return 'Stagnation'; // Si le coefficient stagne, couleur orange
    }
  }

  calculerMoyenneEvolutions(): number {
    let totalEvolutions = 0;

    for (let i = 0; i < this.histo.length; i++) {
      const evolution = this.histo[i].coef_apres - this.histo[i].coef_avant;
      totalEvolutions += evolution;
    }

    const moyenne = totalEvolutions / this.histo.length;
    return moyenne;
  }

  nombreQuestion(element: Element_Historique): number {
    let count = 0;

    // Parcours des éléments pour obtenir les statistiques de l'élément spécifique
    for (const e of this.histo) {
      if (e.intitule_question === element.intitule_question) {
        count++;
      }
    }
    return(count);
  }

  nombreQuestionsUniques(): number {
    const uniqueQuestions = new Set<string>();
    for (const element of this.histo) {
      uniqueQuestions.add(element.intitule_question);
    }
    return uniqueQuestions.size;
  }

  coefMoyenQuestion(element: Element_Historique): number
  {
    let count = 0;
    let totalCoefficient = 0;

    // Parcours des éléments pour obtenir les statistiques de l'élément spécifique
    for (const e of this.histo) {
      if (e.intitule_question === element.intitule_question) {
        count++;
        totalCoefficient += e.coef_apres - e.coef_avant;
      }
    }
    return(totalCoefficient / count);
  }

}
