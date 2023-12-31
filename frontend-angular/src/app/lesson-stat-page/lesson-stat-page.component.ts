import {Component, OnInit} from '@angular/core';
import {Element_Historique, LearningPackage, Question} from "../created-interfaces";
import {StatService} from "../statservice";
import {QuestionService} from "../questionservice";
import {ActivatedRoute, Router} from "@angular/router";
import {LessonPackageService} from "../lessonpackageservice";


@Component({
  selector: 'app-lesson-stat-page',
  templateUrl: './lesson-stat-page.component.html',
  styleUrls: ['./lesson-stat-page.component.css']
})

export class LessonStatPageComponent implements OnInit {
  histo :Element_Historique[] = [];
  id_package:number = -1;
  currentLearningPackage: LearningPackage | null = null;
  Questions: Question[] = [];

  constructor(private Sservice: StatService, private Qservice: QuestionService,
              private activatedRoute: ActivatedRoute,
              private LPservice: LessonPackageService,
              private router: Router) {}

  ngOnInit() {
    console.log('on init de stat page atteint');

    //On récupère le package
    this.activatedRoute.params.subscribe(params => {
        this.id_package = +params['id'];
        this.LPservice.getLPwithid(this.id_package).subscribe(
          (data) => {
            this.currentLearningPackage = data;
            console.log('LP de la page stat',data);
          },
          (error) => {
            console.error('Une erreur s\'est produite lors de la récupération du learning package :', error);
          }
        );
      }
    );

    //On récupère la liste des questions
    this.activatedRoute.params.subscribe(params => {
      this.id_package = +params['id'];
      this.Sservice.getHistorique(this.id_package).subscribe(
        (data) => {
          this.histo = data;
          console.log('historique de la page stat',data);
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la récupération de l historique :', error);
        }
      );
    });

    //On récupère l'historique du package
    this.activatedRoute.params.subscribe(params => {
      this.id_package = +params['id'];
      this.Qservice.getQuestionOfLP(this.id_package).subscribe(
        (data) => {
          this.Questions = data;
          console.log('questions du package',data);
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la récupération des questions :', error);
        }
      );
    });
  }

  //Formatage de la date sous forme de string
  formatDateTime(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
  }

  //couleur en fonction de la diff de coeff
  getColor(diff:number): string {
    if (diff > 0) {
      return 'green'; // Si le coefficient augmente, couleur verte
    } else if (diff <0) {
      return 'red'; // Si le coefficient régresse, couleur rouge
    } else {
      return 'orange'; // Si le coefficient stagne, couleur orange
    }
  }

  //Texte en fonction de la diff de coeff
  getString(coefAvant: number, coefApres: number): string {
    if (coefAvant < coefApres) {
      return 'Progression'; // Si le coefficient augmente
    } else if (coefAvant > coefApres) {
      return 'Régression'; // Si le coefficient régresse
    } else {
      return 'Stagnation'; // Si le coefficient stagne
    }
  }

  //Calcule la moyenne d'evolutions de coeff du package
  calculerMoyenneEvolutions(): number {
    let totalEvolutions = 0;

    for (let i = 0; i < this.histo.length; i++) {
      const evolution = this.histo[i].coef_apres - this.histo[i].coef_avant;
      totalEvolutions += evolution;
    }

    const moyenne = totalEvolutions / this.histo.length;
    return parseFloat(moyenne.toFixed(2));
  }

  //Retourne le nombre de fois qu'une questions spécifique est apparue
  nombreQuestion(q: Question): number {
    let count = 0;

    // Parcours des éléments pour obtenir les statistiques de l'élément spécifique
    for (const e of this.histo) {
      if (e.intitule_question === q.intitule_question) {
        count++;
      }
    }
    return(count);
  }

  //Retourne le nombre de questions uniques du package apparues dans l'historique
  nombreQuestionsUniquesEtudiees(): number {
    const uniqueQuestions = new Set<string>();
    for (const element of this.histo) {
      uniqueQuestions.add(element.intitule_question);
    }
    return uniqueQuestions.size;
  }

  //Coef moyen des questions : evolution moyenne
  coefMoyenQuestion(q: Question): number
  {
    let count = 0;
    let totalCoefficient = 0;

    // Parcours des éléments pour obtenir les statistiques de l'élément spécifique
    for (const e of this.histo) {
      if (e.intitule_question === q.intitule_question) {
        count++;
        totalCoefficient += e.coef_apres - e.coef_avant;
      }
    }
    return(totalCoefficient / count);
  }

  //Evolution totale
  coefTotalQuestion(q: Question)
  {
    let count = 0;
    let totalCoefficient = 0;

    // Parcours des éléments pour obtenir les statistiques de l'élément spécifique
    for (const e of this.histo) {
      if (e.intitule_question === q.intitule_question) {
        count++;
        totalCoefficient += e.coef_apres - e.coef_avant;
      }
    }
    return(totalCoefficient);
  }
}
