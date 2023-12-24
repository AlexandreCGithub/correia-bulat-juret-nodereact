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
  BoolAlerte: boolean = false;

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

            //Pas assez de questions pour le nombre sélectionné
            if(data.length<this.number_questions)
            {
              this.number_questions=data.length;
              this.BoolAlerte = true;
            }


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

  //Les Questions sont sélectionnées en fonction de leur coef actuel
  selectRandomQuestions(): void {
    // On copie et trie les Questions en fonction de leur coef_question
    const sortedQuestions = this.Questions.slice().sort((a, b) => a.coef_question - b.coef_question);
    const weightedQuestions = [];
    let totalWeight = 0;

    // Calcul des poids et création du tableau pondéré
    for (const question of sortedQuestions) {
      const weight = 100 - question.coef_question;
      totalWeight += weight;
      weightedQuestions.push({ question, weight });
    }

    // Sélection aléatoire en fonction des poids
    const selected = [];
    while (selected.length < this.number_questions && totalWeight > 0) {
      let randomWeight = Math.floor(Math.random() * totalWeight);

      // Trouver la question correspondant au poids aléatoire
      let selectedIndex = -1;
      for (let i = 0; i < weightedQuestions.length; i++) {
        if (randomWeight < weightedQuestions[i].weight) {
          selectedIndex = i;
          break;
        }
        randomWeight -= weightedQuestions[i].weight;
      }

      // Ajouter la question sélectionnée et ajuster le poids total
      if (selectedIndex !== -1) {
        selected.push(weightedQuestions[selectedIndex].question);
        totalWeight -= weightedQuestions[selectedIndex].weight;
        weightedQuestions.splice(selectedIndex, 1);
      }
    }

    this.randomQuestions = selected;
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
