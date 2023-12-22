export interface LearningPackage
{
  id_lp: number;
  nom_lp: string;
  description_lp:string;
}

export interface Question
{
  id_question: number;
  intitule_question: string;
  reponse_question: string;
  coef_question: number;
  id_lp: number;
}

//CreatedLearningPackage représente la structure pour les LP créés mais pas encore insérés dans la bdd et qui n'ont pas encore d'id
export interface CreatedLearningPackage
{
  nom_lp: string;
  description_lp:string;
}

//CreatedQuestion représente la structure pour les questions créées mais pas encore insérées dans la bdd et qui n'ont pas encore d'id_question et de coeff
export interface CreatedQuestion
{
  intitule_question: string;
  reponse_question: string;
  id_lp: number;
}
