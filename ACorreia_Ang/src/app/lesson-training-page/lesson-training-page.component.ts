import { Component } from '@angular/core';
import {LearningPackage, Question} from "../created-interfaces";
import {ActivatedRoute, Router} from "@angular/router";
import {LessonPackageService} from "../lessonpackageservice";
import {QuestionService} from "../questionservice";

@Component({
  selector: 'app-lesson-training-page',
  templateUrl: './lesson-training-page.component.html',
  styleUrls: ['./lesson-training-page.component.css']
})
export class LessonTrainingPageComponent {
  Questions: Question[] = [];
  randomQuestions: Question[] = [];
  currentQuestionIndex: number = 0;
  showAnswer: boolean = false;
  trainingEnd: boolean = false;

  currentLearningPackage: LearningPackage | null = null;
  id_package: number = -1;
  number_questions: number = -1;

  constructor(private activatedRoute: ActivatedRoute,
              private router : Router,
              private LPservice:LessonPackageService,
              private Qservice: QuestionService){}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
        this.id_package = +params['id'];
        this.number_questions = +params['q'];
        this.Qservice.getQuestionOfLP(this.id_package).subscribe(
          (data) => {
            this.Questions = data;
            console.log(data);
            this.selectRandomQuestions();
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

  selectRandomQuestions() {
    const shuffledQuestions = this.Questions.sort(() => Math.random() - 0.5);
    console.log(this.Questions);
    this.randomQuestions = shuffledQuestions.slice(0, this.number_questions);
  }

  nextQuestion() {
    this.Qservice.putQuestion(this.randomQuestions[this.currentQuestionIndex]).subscribe(); //La question va être update, la seule modif étant le coef
    this.showAnswer = false;
    if (this.currentQuestionIndex < this.randomQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
    else
    {
      this.trainingEnd = true;
    }
  }

  reponse_su()
  {
    //On progresse de 20%
    this.randomQuestions[this.currentQuestionIndex].coef_question += 20;
    this.nextQuestion();
  }

  reponse_moyen()
  {
    //On progresse uniquement si l'apprentissage n'était qu'à moins de 50%
    //Si on était à plus de 80%, on va même régresser
    if(this.randomQuestions[this.currentQuestionIndex].coef_question<50)
    {
      this.randomQuestions[this.currentQuestionIndex].coef_question += 10;
    }
      if(this.randomQuestions[this.currentQuestionIndex].coef_question>80)
      {
        this.randomQuestions[this.currentQuestionIndex].coef_question -=20;
      }



    this.nextQuestion();
  }

  reponse_non_su()
  {
    //On retombe à 0
    this.randomQuestions[this.currentQuestionIndex].coef_question = 0;
    this.nextQuestion();
  }

  recommencer()
  {
    window.location.reload();
  }

}
