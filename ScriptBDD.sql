-- Role: "learningDbUser_arti"
DROP ROLE IF EXISTS "learningDbUser_arti";

CREATE ROLE "learningDbUser_arti" WITH
  LOGIN
  SUPERUSER
  INHERIT
  CREATEDB
  CREATEROLE
  REPLICATION
  ENCRYPTED PASSWORD 'SCRAM-SHA-256$4096:Hpq3TkwDoJ+leTxma14F8w==$5qp+H7ytRNovp8kv+k92ZVuJP8dFTL0StIpNKREuc0Y=:z4PRvcGQVJjyR/kqHtvDwOJxUve8mL6hRbJGNL0SO2M=';
  --Le mot de passe est 1234

DROP TRIGGER IF EXISTS update_coef_trigger ON Questions;
DROP TRIGGER IF EXISTS update_histo_trigger ON Questions;

DROP FUNCTION IF EXISTS update_coef();
DROP FUNCTION IF EXISTS update_question_history();


DROP TABLE IF EXISTS Historique_Modif_Questions;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS LearningPackage;



CREATE TABLE LearningPackage (
	Id_LP SERIAL PRIMARY KEY,
	Nom_LP VARCHAR(100),
	Description_LP VARCHAR(100),
	Coef_Moyen INT DEFAULT 0 --Coeff moyen, entre 0 et 100, est arrondi si besoin et recalculé par trigger à chaque update
);

CREATE TABLE Questions (
    Id_Question SERIAL PRIMARY KEY,
    Intitule_Question VARCHAR(100),
	Reponse_Question VARCHAR(100),
    Coef_Question INT, --Coeff moyen, entre 0 et 100
    Id_LP INT,
    CONSTRAINT fk_learning_package FOREIGN KEY (Id_LP) REFERENCES LearningPackage(Id_LP) ON DELETE CASCADE
);


CREATE TABLE Historique_Modif_Questions(
	Id_H SERIAL PRIMARY KEY,
	Date_H TIMESTAMP(0),
	Coef_avant INT,
	Coef_apres INT,
	Nom_LP VARCHAR(100),
	Intitule_Question VARCHAR(100)
);


CREATE OR REPLACE FUNCTION update_coef()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE LearningPackage
    SET Coef_Moyen = (
        SELECT COALESCE(SUM(Coef_Question) / COUNT(*), -1)
        FROM Questions
        WHERE Id_LP = NEW.Id_LP
    )
    WHERE Id_LP = NEW.Id_LP;
	
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_question_history()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Historique_Modif_Questions (Date_H, Coef_avant, Coef_apres, Nom_LP, Intitule_Question)
    VALUES (CURRENT_TIMESTAMP, OLD.Coef_Question, NEW.Coef_Question, (SELECT Nom_LP FROM LearningPackage WHERE Id_LP = NEW.Id_LP), NEW.Intitule_Question);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;





CREATE OR REPLACE TRIGGER update_coef_trigger
AFTER INSERT OR UPDATE OR DELETE ON Questions
FOR EACH ROW
EXECUTE FUNCTION update_coef();

CREATE OR REPLACE TRIGGER update_histo_trigger
AFTER UPDATE ON Questions
FOR EACH ROW
EXECUTE FUNCTION update_question_history();



INSERT INTO LearningPackage (Nom_LP, Description_LP) VALUES
('Culture_cine', 'Learning Package dédié à la culture cinématographique'),
('Culture_music', 'Learning Package dédié à la culture musicale'),
('Culture_archi', 'Learning Package dédié à la culture architecturale'),
('Culture_visuels', 'Learning Package dédié aux arts visuels'),
('Culture_litt', 'Learning Package dédié à la littérature');

INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Qui a réalisé le film "Citizen Kane"?', 'Orson Welles', 0, 1),
('Quel film a remporté l Oscar du meilleur film en 1994?', 'Forrest Gump', 0, 1),
('Dans quel film la phrase "Je suis ton père" est-elle célèbre?', 'Star Wars: L Empire contre-attaque', 0, 1),
('Quelle actrice a joué dans "Breakfast at Tiffany s"?', 'Audrey Hepburn', 0, 1),
('Quel est le premier film de la franchise James Bond?', 'James Bond 007 contre Dr. No', 0, 1),
('Quel réalisateur est connu pour "Pulp Fiction" et "Kill Bill"?', 'Quentin Tarantino', 0, 1),
('Nommez un film célèbre de science-fiction des années 80.', 'Blade Runner', 0, 1),
('Quel film est basé sur le roman "Le Parrain" de Mario Puzo?', 'Le Parrain', 0, 1),
('Qui a remporté l Oscar de la meilleure actrice en 2000?', 'Julia Roberts', 0, 1),
('Quel film a popularisé la réplique "Here s Johnny!"?', 'Shining', 0, 1);


INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Qui est le compositeur de la 5ème symphonie de Beethoven?', 'Ludwig van Beethoven', 0, 2),
('Quel groupe a enregistré l album The Dark Side of the Moon?', 'Pink Floyd', 0, 2),
('De quel pays vient le reggae?', 'Jamaïque', 0, 2),
('Qui a chanté Like a Rolling Stone?', 'Bob Dylan', 0, 2),
('Quel est le vrai nom de Lady Gaga?', 'Stefani Joanne Angelina Germanotta', 0, 2),
('Quel est le genre de musique associé à Elvis Presley?', 'Rock and Roll', 0, 2),
('Qui a composé les Quatre Saisons?', 'Antonio Vivaldi', 0, 2),
('Quelle chanteuse est connue pour Single Ladies (Put a Ring on It)?', 'Beyoncé', 0, 2),
('Qui est le leader du groupe U2?', 'Bono', 0, 2),
('Quel artiste est célèbre pour son album Thriller?', 'Michael Jackson', 0, 2);

INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Qui a conçu le Guggenheim Museum à Bilbao?', 'Frank Gehry', 0, 3),
('Quelle est la caractéristique principale de l architecture gothique?', 'Les arcs-boutants', 0, 3),
('Dans quelle ville se trouve la Sagrada Familia?', 'Barcelone', 0, 3),
('Quel architecte a conçu la Fallingwater House?', 'Frank Lloyd Wright', 0, 3),
('Le Burj Khalifa est situé dans quelle ville?', 'Dubaï', 0, 3),
('Qui est l architecte derrière le Louvre Pyramid?', 'Ieoh Ming Pei', 0, 3),
('Le terme Brutalisme vient de quel mot français?', 'Béton brut', 0, 3),
('Quel est le style architectural prédominant du château de Versailles?', 'Baroque', 0, 3),
('Quel célèbre architecte a conçu le plan de la ville de Brasilia?', 'Oscar Niemeyer', 0, 3),
('Le Taj Mahal est un exemple de quel style architectural?', 'Moghul', 0, 3);

INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Qui a peint La Joconde?', 'Léonard de Vinci', 0, 4),
('Quel mouvement artistique est associé à Claude Monet?', 'Impressionnisme', 0, 4),
('Qui est l artiste derrière la sculpture du David?', 'Michel-Ange', 0, 4),
('Quel est le nom de l appareil conçu par Louis Daguerre?', 'Daguerréotype', 0, 4),
('Quel artiste a créé la série de peintures Les Nymphéas?', 'Claude Monet', 0, 4),
('Qui est l auteur de la photographie Migrant Mother pendant la Grande Dépression?', 'Dorothea Lange', 0, 4),
('Dans quelle ville se trouve la galerie Uffizi?', 'Florence', 0, 4),
('Qui a peint La Nuit étoilée?', 'Vincent van Gogh', 0, 4),
('Quel peintre est célèbre pour ses tableaux de paysages américains du XIXe siècle?', 'Albert Bierstadt', 0, 4),
('Quelle est la technique principale utilisée dans l art de la tapisserie?', 'Tissage', 0, 4);


INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Qui a écrit "1984"?', 'George Orwell', 0, 5),
('Dans quel roman peut-on trouver le personnage d Elizabeth Bennet?', 'Orgueil et Préjugés', 0, 5),
('Qui est l auteur des "Misérables"?', 'Victor Hugo', 0, 5),
('Quel poète a écrit "The Raven"?', 'Edgar Allan Poe', 0, 5),
('Qui a écrit "À la recherche du temps perdu"?', 'Marcel Proust', 0, 5),
('Quel est le premier roman de Gabriel García Márquez?', 'La Hojarasca', 0, 5),
('Qui a écrit "Le Vieil Homme et la Mer"?', 'Ernest Hemingway', 0, 5),
('Quel roman de Jane Austen se déroule principalement à Bath?', 'Persuasion', 0, 5),
('Qui est l auteur de "Crime et Châtiment"?', 'Fiodor Dostoïevski', 0, 5),
('Dans quel livre trouve-t-on le personnage de Holden Caulfield?', 'L Attrape-cœurs', 0, 5);