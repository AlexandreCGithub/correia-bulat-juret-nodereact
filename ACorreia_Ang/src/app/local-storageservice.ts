// local-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  // Sauvegarder l'ID dans le stockage local (sous forme string)
  saveLastSelectedId(id: string): void {
    localStorage.setItem('lastSelectedId', id);
  }

  // Récupérer l'ID depuis le stockage local (sous forme string)
  getLastSelectedId(): string | null {
    return localStorage.getItem('lastSelectedId');
  }

  //Ajouter un item aux favoris
  //Cette fois l'ID est la clé et non pas la valeur
  AddToFavorites(id: string) : void{
    localStorage.setItem(id,'isFavorite');
  }

  //Retirer des favoris
  RemoveFromFavorites(id: string) {
    localStorage.removeItem(id);
  }

  //Vérifier si dans les favoris
  IsInFavorites(id: string):boolean
  {
    const a = localStorage.getItem(id);
    return(a==='isFavorite');
  }
}

