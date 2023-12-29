import {Component, OnInit} from '@angular/core'
import {LearningPackage} from "../created-interfaces";
import {LessonPackageService} from "../lessonpackageservice";
import {ActivatedRoute, Router} from "@angular/router";
import {CreatedLearningPackage} from "../created-interfaces";

@Component({
  selector: 'app-lesson-list-page',
  templateUrl: './lesson-list-page.component.html',
  styleUrls: ['./lesson-list-page.component.css']
})
export class LessonListPageComponent implements OnInit {
  learningPackages : LearningPackage[] = [];
  nom_nouveau_lp: string ='';
  description_nouveau_lp: string = '';
  constructor(private LPservice: LessonPackageService) {}

  ngOnInit() {
    console.log('on init lesson list page atteint');
    //Récupération des LP
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

  //Fonction de suppression d'un LP
  deletePackage(p: any) {

    //Demande à l'utilisateur
    const isConfirmed = confirm('Etes-vous sûr de vouloir supprimer ce learning package ?');

    if (isConfirmed) {
      console.log('Fonction deletePackage atteinte dans le front');
      this.LPservice.deleteLP(p.id_lp).subscribe();
      window.location.reload();   //rechargement de la page pour recharger les données mises à jour
    } else {
      console.log('Annulé');
    }
  }

  //Fonction d'ajout d'un nouveau LP
  createLearningPackage() {
    const newLearningPackage: CreatedLearningPackage = {
      nom_lp: this.nom_nouveau_lp,
      description_lp: this.description_nouveau_lp
    };
    console.log('Création d un nouveau LearningPackage lancée',newLearningPackage);
    this.LPservice.postLP(newLearningPackage).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
    window.location.reload();
  }
}
