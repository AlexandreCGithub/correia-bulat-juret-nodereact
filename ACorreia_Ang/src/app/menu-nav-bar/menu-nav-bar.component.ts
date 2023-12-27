import { Component } from '@angular/core';
import {LearningPackage} from "../created-interfaces";
import {LessonPackageService} from "../lessonpackageservice";


@Component({
  selector: 'app-menu-nav-bar',
  templateUrl: './menu-nav-bar.component.html',
  styleUrls: ['./menu-nav-bar.component.css']
})
export class MenuNavBarComponent {
  learningPackages : LearningPackage[] = [];

  constructor(private LPservice: LessonPackageService) {}

  ngOnInit() {
    console.log('on init menu nav bar atteint');

    //Récupération des LP
    this.LPservice.getLP().subscribe(
      (data) => {
        this.learningPackages = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des LP pour la barre navbar :', error);
      }
    );
  }
}

