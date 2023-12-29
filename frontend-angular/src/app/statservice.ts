import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Element_Historique} from "./created-interfaces";

@Injectable({
  providedIn: 'root',
})
export class StatService {
  constructor(private http: HttpClient) {}
  getHistorique(id_lp:number): Observable<Element_Historique[]> {
    return this.http.get<Element_Historique[]>(`/api/historique-package/${id_lp}`)
      .pipe(
        map(response => response)
      );
  }
}
