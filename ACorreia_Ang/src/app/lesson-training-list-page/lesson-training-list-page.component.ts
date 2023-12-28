import {Component, OnInit} from '@angular/core';
import {LearningPackage} from "../created-interfaces";
import {LessonPackageService} from "../lessonpackageservice";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../local-storageservice";

@Component({
  selector: 'app-lesson-training-list-page',
  templateUrl: './lesson-training-list-page.component.html',
  styleUrls: ['./lesson-training-list-page.component.css']
})
export class LessonTrainingListPageComponent implements OnInit {
  learningPackages : LearningPackage[] = [];
  selectedQuestionCount: number = 10;
  constructor(private LPservice: LessonPackageService, private StorageService: LocalStorageService, private router: Router) {}

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

  goToTrainingPage(id: number, count: number): void {
    this.StorageService.saveLastSelectedId(id.toString());
    this.router.navigate(['/lesson-training-page', id, count]);
  }

  isLastTriedPackage(id: string): boolean {
    const lastTriedId = this.StorageService.getLastSelectedId();
    return lastTriedId === id;
  }

  isFavorite(id: string): boolean {
    return this.StorageService.IsInFavorites(id);
  }

  toggleFavorite(id: string): void {
    if (this.StorageService.IsInFavorites(id)) {
      this.StorageService.RemoveFromFavorites(id);
    } else {
      this.StorageService.AddToFavorites(id);
    }
  }

}
