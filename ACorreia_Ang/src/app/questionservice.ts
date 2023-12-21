import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Question} from "./created-interfaces";

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
}
