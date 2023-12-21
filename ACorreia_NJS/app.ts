import * as express from 'express';
import {Request, Response} from 'express';
import sequelize from './sequelize';
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
        const result = await sequelize.query('SELECT * FROM LearningPackage');
        let learningpackages = result[0];

        res.json(learningpackages);
        return;
    } catch (error) {
        console.error('Erreur lors de la récupération des packages :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des packages.' });
        return;
    }
});

app.get('/api/learningpackage/:id', async(req: Request, res: Response) => {
    console.log("GET learning packages par id atteint dans le back");
    const packageId = req.params.id;
    try {
        const result = await sequelize.query('SELECT * FROM LearningPackage where Id_LP='+packageId);
        let learningpackage = result[0];

        res.json(learningpackage);
        return;
    } catch (error) {
        console.error('Erreur lors de la récupération du package :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du package.' });
        return;
    }
});

app.delete('/api/delete-learningpackage/:id', async(req: Request, res: Response) => {
    const packageId = req.params.id;
    //On a activé le ON DELETE CASCADE donc on peut supprimer une table, cela supprimera les questions associées
    console.log("DELETE learning package par id atteint dans le back ",packageId);
    try {
        await sequelize.query('DELETE FROM LearningPackage WHERE Id_LP='+packageId);
        return;
    } catch (error) {
        console.error('Erreur lors de la suppression du package :',packageId, error);
        res.status(500).json({ error: 'Erreur lors de la suppression du package.' });
        return;
    }
});

app.post('/api/add-learningpackage', async (req, res) => {
    console.log("POST learning package atteint dans le back");
    try {
        const { nom_lp, description_lp } = req.body;

        // On utilise la protection contre les injections SQL
        const safeNomLp = sequelize.escape(nom_lp);
        const safeDescriptionLp = sequelize.escape(description_lp);

        const result = await sequelize.query(`INSERT INTO LearningPackage (nom_lp, description_lp) VALUES (${safeNomLp}, ${safeDescriptionLp})`);

        res.status(201).json({ message: 'Package ajouté avec succès', id: result[0] });
    } catch (error) {
        console.error('Erreur lors de l ajout du package :', error);
        res.status(500).json({ error: 'Erreur lors de l ajout du package' });
    }
});



//Routes pour questions
app.get('/api/questionsof-learningpackage/:id', async(req: Request, res: Response) => {
    const packageId = req.params.id;
    console.log("GET questions of a learning package atteint dans le back ", packageId);
    try {
        const result = await sequelize.query('SELECT * FROM Questions where Id_LP='+packageId);
        let questions = result[0];
        res.json(questions);
        return;
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
        const result = await sequelize.query('SELECT * FROM Questions where Id_Question='+questionId);
        let question = result[0];
        res.json(question);
        return;
    } catch (error) {
        console.error('Erreur lors de la récupération de la question :',questionId, error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la question.' });
        return;
    }
});

app.delete('/api/delete-question/:id', async(req: Request, res: Response) => {
    const questionId = req.params.id;
    console.log("DELETE question par id atteint dans le back ",questionId);
    try {
        await sequelize.query('DELETE FROM Questions WHERE Id_Question='+questionId);
        return;
    } catch (error) {
        console.error('Erreur lors de la suppression de la question :',questionId, error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la question.' });
        return;
    }
});
