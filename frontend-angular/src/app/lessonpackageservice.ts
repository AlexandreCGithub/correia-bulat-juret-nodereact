import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {CreatedLearningPackage, LearningPackage} from "./created-interfaces";

@Injectable({
  providedIn: 'root',
})
export class LessonPackageService {
  constructor(private http: HttpClient) {}

  //Renvoie un tableau de tous les LP
  getLP(): Observable<LearningPackage[]> {
    return this.http.get<LearningPackage[]>('/api/learningpackages-all')
      .pipe(
        map(response => response)
      );
  }

  //Ne renvoie qu'un seul LP
  getLPwithid(id_lp:number): Observable<LearningPackage> {
    return this.http.get<LearningPackage[]>(`/api/learningpackage/${id_lp}`)
      .pipe(
        map(response => response[0])
      );
  }

  deleteLP(id_lp:number) {
    return this.http.delete(`/api/delete-learningpackage/${id_lp}`);
  }

  postLP(newLearningPackage:CreatedLearningPackage){
    //Pour la requête post on va utiliser CreatedLearningPackage qui est une interface sans l'id, qui n'est pas encore définie
    //CreatedLearningPackage représente la structure pour les LP créés mais pas encore insérés dans la bdd
    //L'id va être définie par la bdd
    return this.http.post('/api/add-learningpackage',newLearningPackage);
  }

  putLp(updatedLearningPackage:LearningPackage)
  {
    console.log('1');
    //Pour la MAJ on on peut simplement utiliser l'interface LearningPackage
    return this.http.put('/api/update-learningpackage',updatedLearningPackage);
  }
}
