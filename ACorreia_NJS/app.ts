import * as express from 'express';
import {Request, Response} from 'express';
import sequelize from './sequelize';
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données LearningFactDb_arti réussie');
    })
    .catch((error) => {
        console.error('Erreur de connexion à la base de données :', error);
    });

const app = express();

const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: { title: "Todo Rest API" },
        servers: [ { url:"http://localhost:3000"}]
    },
    apis: ["./index.js"],
};

const swaggerDoc = swaggerJsdoc(swaggerOptions);
console.log("swagger doc from annotated js:", swaggerDoc);

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDoc));

/**
 * @swagger
 * /todo:
 *   get:
 *     summary: list of todos
 *     responses:
 *       200:
 *         description: OK
 */

app.use(express.json()); // => to parse request body with http header "content-type": "application/json"
app.get('/api/liveness', function (req, res) {
    res.send('OK !!!');
});
console.log('starting...');
app.listen(3000, function () {
    console.log('Ok, started!');
});


//Routes pour learningpackages
app.get('/api/learningpackages-all', async(req: Request, res: Response) => {
    console.log("GET learning packages atteint dans le back");
    try {
        const all_lp = await sequelize.query('SELECT * FROM LearningPackage');
        let learningpackages = all_lp[0];
        res.json(learningpackages);

    } catch (error) {
        console.error('Erreur lors de la récupération des packages :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des packages.' });
    }
});

app.get('/api/learningpackage/:id', async(req: Request, res: Response) => {
    console.log("GET learning packages par id atteint dans le back");
    const packageId = req.params.id;
    try {
        const getQuery ='SELECT * FROM LearningPackage where Id_LP = ?';
        const result = await sequelize.query(getQuery,{replacements: [packageId]})
        res.json(result[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du package :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du package.' });
    }
});

app.delete('/api/delete-learningpackage/:id', async(req: Request, res: Response) => {
    const packageId = req.params.id;
    //On a activé le ON DELETE CASCADE donc on peut supprimer une table, cela supprimera les questions associées
    //Gestion sécurisée du paramètre pour éviter injections
    console.log("DELETE learning package par id atteint dans le back ",packageId);
    try {
        const deleteQuery = `DELETE FROM LearningPackage WHERE Id_LP = ?`;
        const result = await sequelize.query(deleteQuery, {replacements: [packageId]});
        res.status(200).json({ message: 'Package delete avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du package :',packageId, error);
        res.status(500).json({ error: 'Erreur lors de la suppression du package.' });
    }
});

app.post('/api/add-learningpackage', async (req, res) => {
    console.log("POST learning package atteint dans le back");
    try {
        // On utilise la protection contre les injections SQL
        const { nom_lp, description_lp } = req.body;
        const query = 'INSERT INTO LearningPackage (nom_lp, description_lp) VALUES (?, ?)';
        const result = await sequelize.query(query, { replacements: [nom_lp, description_lp] });
        console.log('Nouveau Learning Package créé :', result[0]);
        res.status(201).json({ message: 'Package ajouté avec succès', id: result[0] });
    } catch (error) {
        console.error('Erreur lors de l ajout du package :', error);
        res.status(500).json({ error: 'Erreur lors de l ajout du package' });
    }
});

app.put('/api/update-learningpackage', async (req, res) => {
    console.log("PUT learning package atteint dans le back");
    try {
        // On utilise la protection contre les injections SQL
        const { nom_lp, description_lp, id_lp } = req.body;
        const query = 'UPDATE LearningPackage SET nom_lp = ?, description_lp = ? WHERE id_lp = ?';
        const result = await sequelize.query(query, { replacements: [nom_lp, description_lp, id_lp] });
        res.status(200).json({ message: 'Package MAJ avec succès' });
    } catch (error) {
        console.error('Erreur lors de l update du package :', error);
        res.status(500).json({ error: 'Erreur lors de l update du package' });
    }
});


//Routes pour questions
app.get('/api/questionsof-learningpackage/:id', async(req: Request, res: Response) => {
    const packageId = req.params.id;
    console.log("GET questions of a learning package atteint dans le back ", packageId);
    try {
        const getQuery ='SELECT * FROM Questions where Id_LP = ?';
        const result = await sequelize.query(getQuery,{replacements: [packageId]})
        res.json(result[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération des questions du package :',packageId, error);
        res.status(500).json({ error: 'Erreur lors de la récupération des questions.' });
        return;
    }
});

app.get('/api/question/:id', async(req: Request, res: Response) => {
    const questionId = req.params.id;
    console.log("GET question unique par son id atteint dans le back ", questionId);
    try {
        const getQuery ='SELECT * FROM Questions where Id_Question = ?';
        const result = await sequelize.query(getQuery,{replacements: [questionId]})
        res.json(result[0]);

    } catch (error) {
        console.error('Erreur lors de la récupération de la question :',questionId, error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la question.' });
    }
});

app.delete('/api/delete-question/:id', async(req: Request, res: Response) => {
    const questionId = req.params.id;
    console.log("DELETE question par id atteint dans le back ",questionId);
    try {
        const deleteQuery ='DELETE FROM Questions WHERE Id_Question = ?';
        const result = await sequelize.query(deleteQuery,{replacements: [questionId]})
        res.status(200).json({ message: 'Question delete avec succès' });

    } catch (error) {
        console.error('Erreur lors de la suppression de la question :',questionId, error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la question.' });
    }
});

app.post('/api/add-question', async (req, res) => {
    console.log("POST question atteint dans le back");
    try {
        const {intitule_question,reponse_question,id_lp} = req.body;

        const postQuery = 'INSERT INTO Questions (intitule_question, reponse_question,coef_question,id_lp) VALUES (?,?,?,?)';
        const result = await sequelize.query(postQuery, { replacements: [intitule_question,reponse_question,0,id_lp] });
        console.log('Nouveau Learning Package créé :', result);
        res.status(201).json({ message: 'Question ajoutée avec succès', id: result[0] });
    } catch (error) {
        console.error('Erreur lors de l ajout de la question :', error);
        res.status(500).json({ error: 'Erreur lors de l ajout de la question' });
    }
});


//Cette route est utilisée pour update les scores des questions, ou les infos
app.put('/api/update-question', async (req, res) => {
    console.log("PUT question atteint dans le back");
    try {
        const { intitule_question,reponse_question,coef_question,id_question, id_lp } = req.body;
        const putQuery ='UPDATE Questions SET intitule_question = ?, reponse_question = ?, coef_question = ? WHERE id_question = ?'
        const result = await sequelize.query(putQuery, { replacements: [intitule_question,reponse_question,coef_question,id_question] });
        res.status(200).json({ message: 'Question MAJ avec succès' });
    } catch (error) {
        console.error('Erreur lors de l update de la question :', error);
        res.status(500).json({ error: 'Erreur lors de l update de la question' });
    }
});


//Route pour l'historique

app.get('/api/historique-package/:id', async(req: Request, res: Response) => {
    const packageId = req.params.id;
    console.log("GET historique atteint dans le back du package",packageId);
    try {
        const getQuery = 'SELECT * FROM Historique_Modif_Questions WHERE Id_LP = ?';
        const result = await sequelize.query(getQuery,{ replacements:[packageId]});
        res.json(result[0]);

    } catch (error) {
        console.error('Erreur lors de la récupération de l historique :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l historique.'});
        return;
    }
});