import { Component } from '@angular/core';
import {Element_Historique, LearningPackage} from "../created-interfaces";
import {StatService} from "../statservice";
import {LessonPackageService} from "../lessonpackageservice";

@Component({
  selector: 'app-lesson-stat-page',
  templateUrl: './lesson-stat-page.component.html',
  styleUrls: ['./lesson-stat-page.component.css']
})
export class LessonStatPageComponent {
  histo: Element_Historique[] = [];
  filteredHisto: Element_Historique[] = [];

  learningPackages: LearningPackage[] = [];
  selectedLearningPackageName : string = "tous"; //un nom de learningPackage, ou alors le string "tous"

  constructor(private LPservice : LessonPackageService,private Sservice: StatService){}

  ngOnInit() {
        this.Sservice.getAllHistorique().subscribe(
          (data) => {
            this.histo = data;
            this.filteredHisto = data;
            console.log(data);
          },
          (error) => {
            console.error('Une erreur s\'est produite lors de la récupération de l historique :', error);
          }
        );

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

  formatDateTime(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
  }

  getColor(coefAvant: number, coefApres: number): string {
    if (coefAvant < coefApres) {
      return 'green'; // Si le coefficient augmente, couleur verte
    } else if (coefAvant > coefApres) {
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
}
