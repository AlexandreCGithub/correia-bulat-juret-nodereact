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
	Id_LP INT,
	Intitule_Question VARCHAR(100),
	Id_Question INT,
	CONSTRAINT fk_hist1 FOREIGN KEY (Id_LP) REFERENCES LearningPackage(Id_LP) ON DELETE CASCADE,
    CONSTRAINT fk_hist2 FOREIGN KEY (Id_Question) REFERENCES Questions(Id_Question) ON DELETE CASCADE
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
    INSERT INTO Historique_Modif_Questions (Date_H, Coef_avant, Coef_apres, Nom_LP, Intitule_Question,Id_LP, Id_Question)
    VALUES (CURRENT_TIMESTAMP, OLD.Coef_Question, NEW.Coef_Question, (SELECT Nom_LP FROM LearningPackage WHERE Id_LP = NEW.Id_LP), NEW.Intitule_Question,NEW.Id_LP,NEW.Id_Question);
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



INSERT INTO LearningPackage (Nom_LP, Description_LP) VALUES ('Capitales des Pays', 'Questions sur les capitales des pays');
INSERT INTO LearningPackage (Nom_LP, Description_LP) VALUES ('Musique', 'Questions sur la musique');
INSERT INTO LearningPackage (Nom_LP, Description_LP) VALUES ('Films', 'Questions sur les films');
INSERT INTO LearningPackage (Nom_LP, Description_LP) VALUES ('Littérature', 'Questions sur la littérature');

INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Quelle est la capitale de la France ?', 'Paris', 0, 1),
('Quelle est la capitale de l Espagne ?', 'Madrid', 0, 1),
('Quelle est la capitale de l Italie ?', 'Rome', 0, 1),
('Quelle est la capitale du Canada ?', 'Ottawa', 0, 1),
('Quelle est la capitale de l Allemagne ?', 'Berlin', 0, 1),
('Quelle est la capitale du Japon ?', 'Tokyo', 0, 1),
('Quelle est la capitale de l Inde ?', 'New Delhi', 0, 1),
('Quelle est la capitale de l Australie ?', 'Canberra', 0, 1),
('Quelle est la capitale de la Russie ?', 'Moscou', 0, 1),
('Quelle est la capitale du Brésil ?', 'Brasília', 0, 1),
('Quelle est la capitale de la Chine ?', 'Pékin', 0, 1),
('Quelle est la capitale de l Argentine ?', 'Buenos Aires', 0, 1),
('Quelle est la capitale du Portugal ?', 'Lisbonne', 0, 1),
('Quelle est la capitale de l Égypte ?', 'Le Caire', 0, 1),
('Quelle est la capitale de la Turquie ?', 'Ankara', 0, 1),
('Quelle est la capitale de la Grèce ?', 'Athènes', 0, 1),
('Quelle est la capitale du Mexique ?', 'Mexico', 0, 1),
('Quelle est la capitale du Nigeria ?', 'Abuja', 0, 1),
('Quelle est la capitale de l Iran ?', 'Téhéran', 0, 1),
('Quelle est la capitale du Pakistan ?', 'Islamabad', 0, 1);

INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Qui a chanté Bohemian Rhapsody ?', 'Queen', 0, 2),
('Quel instrument Yo-Yo Ma joue-t-il ?', 'Violoncelle', 0, 2),
('Quel est le genre musical associé à Elvis Presley ?', 'Rock and Roll', 0, 2),
('Quel artiste a interprété la chanson Thriller ?', 'Michael Jackson', 0, 2),
('Quel est le nom complet du groupe ABBA ?', 'ABBA est l acronyme des prénoms des membres du groupe : Agnetha, Björn, Benny et Anni-Frid', 0, 2),
('Quel instrument Miles Davis jouait-il ?', 'Trompette', 0, 2),
('Quel album a popularisé le groupe Nirvana ?', 'Nevermind', 0, 2),
('Quel est le nom du chanteur principal du groupe U2 ?', 'Bono', 0, 2),
('De quel pays est originaire le groupe musical The Beatles ?', 'Royaume-Uni', 0, 2),
('Quelle est la chanson la plus vendue de tous les temps ?', 'White Christmas de Bing Crosby', 0, 2),
('Quel est le nom complet du rappeur Eminem ?', 'Marshall Bruce Mathers III', 0, 2),
('Quel est l instrument principal de Jimi Hendrix ?', 'Guitare électrique', 0, 2),
('Quel est le nom du premier album studio de Michael Jackson en solo ?', 'Got to Be There', 0, 2),
('Quelle chanson a été interprétée par Whitney Houston dans le film The Bodyguard ?', 'I Will Always Love You', 0, 2),
('Quel est le nom du groupe formé par Freddie Mercury ?', 'Queen', 0, 2),
('Quel est le nom du dernier album studio des Beatles ?', 'Let It Be', 0, 2),
('Qui a interprété la chanson Hotel California ?', 'Eagles', 0, 2),
('Quel est le nom du groupe derrière l album The Dark Side of the Moon ?', 'Pink Floyd', 0, 2),
('Quelle chanson a popularisé le groupe Bee Gees ?', 'Stayin Alive', 0, 2),
('Quel est le nom du compositeur de la chanson Moonlight Sonata ?', 'Ludwig van Beethoven', 0, 2);

INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Quel film a remporté l Oscar du meilleur film en 1994 ?', 'Forrest Gump', 0, 3),
('Qui a réalisé le film Inception ?', 'Christopher Nolan', 0, 3),
('Quel est le film gagnant du Prix du Public au Festival de Cannes en 2019 ?', 'Les Misérables', 0, 3),
('Qui a joué le rôle de Neo dans The Matrix ?', 'Keanu Reeves', 0, 3),
('Quel film a remporté le premier Oscar du meilleur film en 1929 ?', 'Les Ailes', 0, 3),
('Qui a réalisé le film Pulp Fiction ?', 'Quentin Tarantino', 0, 3),
('Quel est le nom du vaisseau spatial dans la série de films Star Wars ?', 'Millennium Falcon', 0, 3),
('Quel est le premier film de la trilogie Le Seigneur des Anneaux ?', 'La Communauté de l Anneau', 0, 3),
('Qui a joué le rôle de Jack Dawson dans le film Titanic ?', 'Leonardo DiCaprio', 0, 3),
('Quel film a remporté l Oscar du meilleur film en 2020 ?', 'Parasite', 0, 3),
('Qui a réalisé le film The Dark Knight ?', 'Christopher Nolan', 0, 3),
('Quel est le nom du personnage principal dans le film Fight Club ?', 'Tyler Durden', 0, 3),
('Quel film a remporté l Oscar du meilleur film en 2016 ?', 'Spotlight', 0, 3),
('Qui a joué le rôle de Vito Corleone dans Le Parrain ?', 'Marlon Brando', 0, 3),
('Quel est le nom du robot dans le film Wall-E ?', 'Wall-E', 0, 3),
('Qui a réalisé le film Jurassic Park ?', 'Steven Spielberg', 0, 3),
('Quel est le nom du personnage principal dans Forest Gump ?', 'Forest Gump', 0, 3),
('Quel film a remporté l Oscar du meilleur film en 2010 ?', 'Démineurs', 0, 3),
('Qui a joué le rôle de Wolverine dans la série de films X-Men ?', 'Hugh Jackman', 0, 3),
('Quel est le nom du réalisateur du film Blade Runner ?', 'Ridley Scott', 0, 3);

INSERT INTO Questions (Intitule_Question, Reponse_Question, Coef_Question, Id_LP) VALUES
('Qui a écrit 1984 ?', 'George Orwell', 0, 4),
('Quel est le nom du protagoniste dans Le Petit Prince ?', 'Le Petit Prince', 0, 4),
('Quel écrivain a écrit L Odyssée ?', 'Homère', 0, 4),
('Quel est le titre du livre écrit par Harper Lee et publié en 1960 ?', 'Ne tirez pas sur l oiseau moqueur', 0, 4),
('Qui est l auteur de Don Quichotte ?', 'Miguel de Cervantes', 0, 4),
('Quel est le nom du roman de Victor Hugo publié en 1862 ?', 'Les Misérables', 0, 4),
('Qui est l auteur de la pièce de théâtre Hamlet ?', 'William Shakespeare', 0, 4),
('Quel est le titre de l oeuvre majeure de Franz Kafka publiée à titre posthume ?', 'Le Procès', 0, 4),
('Quel écrivain est connu pour son roman Guerre et Paix ?', 'Léon Tolstoï', 0, 4),
('Quel est le nom de la trilogie de J.R.R. Tolkien ?', 'Le Seigneur des Anneaux', 0, 4),
('Qui est l auteur de la série Harry Potter ?', 'J.K. Rowling', 0, 4),
('Quel est le titre de la pièce de théâtre de Molière qui met en scène le personnage d Harpagon ?', 'L Avare', 0, 4),
('Quel écrivain a écrit Les Trois Mousquetaires ?', 'Alexandre Dumas', 0, 4),
('Quel est le nom du personnage principal dans le livre Le Comte de Monte-Cristo ?', 'Edmond Dantès', 0, 4),
('Qui a écrit Orgueil et Préjugés ?', 'Jane Austen', 0, 4),
('Quel est le nom du recueil de poèmes écrit par Charles Baudelaire ?', 'Les Fleurs du Mal', 0, 4),
('Qui est l auteur de Crime et Châtiment ?', 'Fiodor Dostoïevski', 0, 4),
('Quel écrivain a créé le personnage de Sherlock Holmes ?', 'Arthur Conan Doyle', 0, 4),
('Quel est le titre du roman dystopique écrit par Aldous Huxley ?', 'Le Meilleur des mondes', 0, 4),
('Qui est l auteur de la pièce de théâtre Roméo et Juliette ?', 'William Shakespeare', 0, 4);



