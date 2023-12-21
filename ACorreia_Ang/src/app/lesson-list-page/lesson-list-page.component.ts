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
  constructor(private LPservice: LessonPackageService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    console.log('on init atteint');
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
  goToDetailsPage(p: any) {
    this.router.navigate(['/lesson-detail/', p.id_lp]);
  }

  deletePackage(p: any) {
    // Confirmation dialog
    const isConfirmed = confirm('Etes-vous sûr de vouloir supprimer ce learning package ?');

    if (isConfirmed) {
      console.log('Fonction deletePackage atteinte dans le front');
      this.LPservice.deleteLP(p.id_lp).subscribe();
      window.location.reload();
    } else {
      console.log('Deletion cancelled');
    }
  }

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
