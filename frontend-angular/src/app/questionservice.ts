import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {CreatedLearningPackage, CreatedQuestion, LearningPackage, Question} from "./created-interfaces";

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}
  getQuestionOfLP(id_lp:number): Observable<Question[]> {
    return this.http.get<Question[]>(`/api/questionsof-learningpackage/${id_lp}`)
      .pipe(
        map(response => response)
      );
  }

  postQuestion(newQuestion:CreatedQuestion){
    //Pour la requête post on va utiliser CreatedQuestion qui est une interface sans l'id, qui n'est pas encore définie
    //CreatedQuestion représente la structure pour les Question créées mais pas encore insérées dans la bdd
    //L'id va être définie par la bdd, ainsi que le coeff par le back
    return this.http.post('/api/add-question',newQuestion);
  }

  deleteQuestion(id_q:number) {
    return this.http.delete(`/api/delete-question/${id_q}`);
  }

  putQuestion(updatedQuestion:Question)
  {
    //Pour la MAJ on on peut simplement utiliser l'interface Question
    return this.http.put('/api/update-question',updatedQuestion);
  }
}
