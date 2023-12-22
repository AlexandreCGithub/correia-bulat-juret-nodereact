import {Component, OnInit} from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import {CreatedLearningPackage, LearningPackage, Question,CreatedQuestion} from "../created-interfaces";
import {LessonPackageService} from "../lessonpackageservice";
import {QuestionService} from "../questionservice";

@Component({
  selector: 'app-lesson-detail-page',
  templateUrl: './lesson-detail-page.component.html',
  styleUrls: ['./lesson-detail-page.component.css']
})

export class LessonDetailPageComponent implements OnInit {
  Questions: Question[] = [];
  currentLearningPackage: LearningPackage | null = null;
  id_package: number = -1;
  showUpdateLPForm: boolean = false;
  updateLPSuccess: boolean = false;
  showUpdateQForm: boolean[] = [];
  updateQSuccess:  boolean[] = [];


  intitule_nouvelle_question: string ='';
  reponse_nouvelle_question: string = '';


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

    //Remplissage des tableaux à false
    this.showUpdateQForm = this.Questions.map(() => false);
    this.updateQSuccess = this.Questions.map(() => false);
  }

  createQuestion() {
    const newQuestion: CreatedQuestion = {
      intitule_question: this.intitule_nouvelle_question,
      reponse_question: this.reponse_nouvelle_question,
      id_lp:this.id_package
    };
    console.log('Création d une nouvelle question lancée',newQuestion);
    this.Qservice.postQuestion(newQuestion).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
    window.location.reload();
  }

  deleteQuestion(q: any) {
    // Confirmation dialog
    const isConfirmed = confirm('Etes-vous sûr de vouloir supprimer cette question ?');

    if (isConfirmed) {
      console.log('Suppression confirmée par utilisateur');
      this.Qservice.deleteQuestion(q.id_question).subscribe();
      window.location.reload();
    } else {
      console.log('Suppressio annulée par utilisateur');
    }
  }

  updateLearningPackage()
  {
    console.log('update Learning Package atteint dans le back')
    //Les valeurs pour currentLearningPackage on été modifiées. Il faut maintenant appliquer cette modification dans le back
    //Et donc dans la BDD
    //On n'autorise la MAJ que si le learningPackage est chargé
    if (this.currentLearningPackage !== null) {
      console.log('MAJ déclenchée')
      this.LPservice.putLp(this.currentLearningPackage as LearningPackage).subscribe();
      this.updateLPSuccess = true;
    }
    this.showUpdateLPForm = !this.showUpdateLPForm
  }

  updateQuestion(q:Question)
  {

  }

}


