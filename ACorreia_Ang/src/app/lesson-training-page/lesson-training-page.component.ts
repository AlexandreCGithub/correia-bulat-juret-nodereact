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
              private LPservice:LessonPackageService,
              private Qservice: QuestionService){}


  ngOnInit() {
    //On récupère le LP courant
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

    //On récupère les questions du package, on gère le cas s'il n'y en a pas assez
    this.activatedRoute.params.subscribe(params => {
        this.id_package = +params['id'];
        this.number_questions = +params['q'];
        this.Qservice.getQuestionOfLP(this.id_package).subscribe(
          (data) => {
            this.Questions = data;
            console.log('questions récupérées',data);

            //Pas assez de questions pour le nombre sélectionné: on réduit au nombre maximal possible
            if(data.length<this.number_questions)
            {
              this.number_questions=data.length;
              this.BoolAlerte = true;
            }
            this.selectRandomQuestions();
            console.log('questions random tirées',this.randomQuestions)
          },
          (error) => {
            console.error('Une erreur s\'est produite lors de la récupération des questions :', error);
          }
        );
      }
    );
  }

  //Les Questions sont sélectionnées aléatoirement en fonction de leur coef actuel
  //Plus une question est sue, moins elle a de chances d'apparaître
  selectRandomQuestions(): void {
    // On copie et trie les Questions en fonction de leur coef_question
    const sortedQuestions = this.Questions.slice().sort((a, b) => a.coef_question - b.coef_question);
    const weightedQuestions = [];
    let totalWeight = 0;

    // Calcul des poids et création d'un tableau pondéré question/poids
    for (const question of sortedQuestions) {
      const weight = 100 - question.coef_question;
      totalWeight += weight;
      weightedQuestions.push({ question, weight });
    }

    // Sélection aléatoire en fonction des poids : on prend un chiffre au hasard
    //Entre 0 et somme de tous les poids
    //Plus le poids est important (max 100) plus on a de chance de s'arreter sur la question
    //Fonction expliqué plus en détail dans le guide_readme
    const selected = [];
    while (selected.length < this.number_questions && totalWeight > 0) {
      let randomWeight = Math.floor(Math.random() * totalWeight);
      // Trouver la question correspondant au poids aléatoire tiré
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


  //Fonction pour passer la page à la question suivante
  nextQuestion() {
    this.Qservice.putQuestion(this.randomQuestions[this.currentQuestionIndex]).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de l update du coeff de la question :', error);
      }
    ); //La question va être update, la seule modif étant le coef
    this.showAnswer = false;
    if (this.currentQuestionIndex < this.randomQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
    else
    {
      this.trainingEnd = true;
    }
  }

  //si succès signalé
  reponse_su()
  {
    //On progresse de 20%
    this.randomQuestions[this.currentQuestionIndex].coef_question += 20;
    this.nextQuestion();
  }

  //si apprentissage moyen signalé
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

  //si question non sue
  reponse_non_su()
  {
    //On retombe à 0
    this.randomQuestions[this.currentQuestionIndex].coef_question = 0;
    this.nextQuestion();
  }

  //Si l'utilisateur veut recommencer: on recharge simplement la page
  //Le composant sera recréé et un nouveau set de questions (prenant en compte ce qu'on vient de faire!) va être tiré
  recommencer()
  {
    window.location.reload();
  }

}
