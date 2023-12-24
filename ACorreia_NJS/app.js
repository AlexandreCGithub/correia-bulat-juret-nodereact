"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var sequelize_1 = require("./sequelize");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
sequelize_1.default.authenticate()
    .then(function () {
    console.log('Connexion à la base de données LearningFactDb_arti réussie');
})
    .catch(function (error) {
    console.error('Erreur de connexion à la base de données :', error);
});
var app = express();
var swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: { title: "Todo Rest API" },
        servers: [{ url: "http://localhost:3000" }]
    },
    apis: ["./index.js"],
};
var swaggerDoc = swaggerJsdoc(swaggerOptions);
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
app.get('/api/learningpackages-all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var all_lp, learningpackages, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET learning packages atteint dans le back");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.default.query('SELECT * FROM LearningPackage')];
            case 2:
                all_lp = _a.sent();
                learningpackages = all_lp[0];
                res.json(learningpackages);
                return [2 /*return*/];
            case 3:
                error_1 = _a.sent();
                console.error('Erreur lors de la récupération des packages :', error_1);
                res.status(500).json({ error: 'Erreur lors de la récupération des packages.' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/api/learningpackage/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var packageId, result, learningpackage, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET learning packages par id atteint dans le back");
                packageId = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.default.query('SELECT * FROM LearningPackage where Id_LP=' + packageId)];
            case 2:
                result = _a.sent();
                learningpackage = result[0];
                res.json(learningpackage);
                return [2 /*return*/];
            case 3:
                error_2 = _a.sent();
                console.error('Erreur lors de la récupération du package :', error_2);
                res.status(500).json({ error: 'Erreur lors de la récupération du package.' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/delete-learningpackage/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var packageId, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                packageId = req.params.id;
                //On a activé le ON DELETE CASCADE donc on peut supprimer une table, cela supprimera les questions associées
                console.log("DELETE learning package par id atteint dans le back ", packageId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.default.query('DELETE FROM LearningPackage WHERE Id_LP=' + packageId)];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                error_3 = _a.sent();
                console.error('Erreur lors de la suppression du package :', packageId, error_3);
                res.status(500).json({ error: 'Erreur lors de la suppression du package.' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/api/add-learningpackage', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nom_lp, description_lp, safeNomLp, safeDescriptionLp, result, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("POST learning package atteint dans le back");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, nom_lp = _a.nom_lp, description_lp = _a.description_lp;
                safeNomLp = sequelize_1.default.escape(nom_lp);
                safeDescriptionLp = sequelize_1.default.escape(description_lp);
                return [4 /*yield*/, sequelize_1.default.query("INSERT INTO LearningPackage (nom_lp, description_lp) VALUES (".concat(safeNomLp, ", ").concat(safeDescriptionLp, ")"))];
            case 2:
                result = _b.sent();
                res.status(201).json({ message: 'Package ajouté avec succès', id: result[0] });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('Erreur lors de l ajout du package :', error_4);
                res.status(500).json({ error: 'Erreur lors de l ajout du package' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.put('/api/update-learningpackage', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nom_lp, description_lp, id_lp, safeNomLp, safeDescriptionLp, safeIdLp, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("PUT learning package atteint dans le back");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, nom_lp = _a.nom_lp, description_lp = _a.description_lp, id_lp = _a.id_lp;
                safeNomLp = sequelize_1.default.escape(nom_lp);
                safeDescriptionLp = sequelize_1.default.escape(description_lp);
                safeIdLp = sequelize_1.default.escape(id_lp);
                return [4 /*yield*/, sequelize_1.default.query("UPDATE LearningPackage SET nom_lp = ".concat(safeNomLp, ", description_lp = ").concat(safeDescriptionLp, " WHERE id_lp = ").concat(safeIdLp))];
            case 2:
                result = _b.sent();
                res.status(200).json({ message: 'Package MAJ avec succès' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error('Erreur lors de l update du package :', error_5);
                res.status(500).json({ error: 'Erreur lors de l update du package' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Routes pour questions
app.get('/api/questionsof-learningpackage/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var packageId, result, questions, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                packageId = req.params.id;
                console.log("GET questions of a learning package atteint dans le back ", packageId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.default.query('SELECT * FROM Questions where Id_LP=' + packageId)];
            case 2:
                result = _a.sent();
                questions = result[0];
                res.json(questions);
                return [2 /*return*/];
            case 3:
                error_6 = _a.sent();
                console.error('Erreur lors de la récupération des questions du package :', packageId, error_6);
                res.status(500).json({ error: 'Erreur lors de la récupération des questions.' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/api/question/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var questionId, result, question, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                questionId = req.params.id;
                console.log("GET question unique par son id atteint dans le back ", questionId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.default.query('SELECT * FROM Questions where Id_Question=' + questionId)];
            case 2:
                result = _a.sent();
                question = result[0];
                res.json(question);
                return [2 /*return*/];
            case 3:
                error_7 = _a.sent();
                console.error('Erreur lors de la récupération de la question :', questionId, error_7);
                res.status(500).json({ error: 'Erreur lors de la récupération de la question.' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/delete-question/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var questionId, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                questionId = req.params.id;
                console.log("DELETE question par id atteint dans le back ", questionId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.default.query('DELETE FROM Questions WHERE Id_Question=' + questionId)];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                error_8 = _a.sent();
                console.error('Erreur lors de la suppression de la question :', questionId, error_8);
                res.status(500).json({ error: 'Erreur lors de la suppression de la question.' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/api/add-question', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, intitule_question, reponse_question, id_lp, safe_id_lp, safe_intitule_question, safe_reponse_question, result, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("POST question atteint dans le back");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, intitule_question = _a.intitule_question, reponse_question = _a.reponse_question, id_lp = _a.id_lp;
                safe_id_lp = sequelize_1.default.escape(id_lp);
                safe_intitule_question = sequelize_1.default.escape(intitule_question);
                safe_reponse_question = sequelize_1.default.escape(reponse_question);
                return [4 /*yield*/, sequelize_1.default.query("INSERT INTO Questions (intitule_question, reponse_question,coef_question,id_lp) VALUES (".concat(safe_intitule_question, ", ").concat(safe_reponse_question, ",0 ,").concat(safe_id_lp, ")"))];
            case 2:
                result = _b.sent();
                res.status(201).json({ message: 'Question ajoutée avec succès', id: result[0] });
                return [3 /*break*/, 4];
            case 3:
                error_9 = _b.sent();
                console.error('Erreur lors de l ajout de la question :', error_9);
                res.status(500).json({ error: 'Erreur lors de l ajout de la question' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Cette route est utilisée pour update les scores des questions, ou les infos
app.put('/api/update-question', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, intitule_question, reponse_question, coef_question, id_question, id_lp, safe_id_lp, safe_intitule_question, safe_reponse_question, safe_coef_question, safe_id_question, result, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("PUT question atteint dans le back");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, intitule_question = _a.intitule_question, reponse_question = _a.reponse_question, coef_question = _a.coef_question, id_question = _a.id_question, id_lp = _a.id_lp;
                safe_id_lp = sequelize_1.default.escape(id_lp);
                safe_intitule_question = sequelize_1.default.escape(intitule_question);
                safe_reponse_question = sequelize_1.default.escape(reponse_question);
                safe_coef_question = sequelize_1.default.escape(coef_question);
                safe_id_question = sequelize_1.default.escape(id_question);
                return [4 /*yield*/, sequelize_1.default.query("UPDATE Questions SET intitule_question = ".concat(safe_intitule_question, ", reponse_question = ").concat(safe_reponse_question, ", coef_question = ").concat(safe_coef_question, " WHERE id_question = ").concat(safe_id_question))];
            case 2:
                result = _b.sent();
                res.status(200).json({ message: 'Question MAJ avec succès' });
                return [3 /*break*/, 4];
            case 3:
                error_10 = _b.sent();
                console.error('Erreur lors de l update de la question :', error_10);
                res.status(500).json({ error: 'Erreur lors de l update de la question' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Route pour l'historique
app.get('/api/historique-package/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var packageId, reponse, histo, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                packageId = req.params.id;
                console.log("GET historique atteint dans le back du package", packageId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.default.query('SELECT * FROM Historique_Modif_Questions WHERE Id_LP=' + packageId)];
            case 2:
                reponse = _a.sent();
                histo = reponse[0];
                res.json(histo);
                return [2 /*return*/];
            case 3:
                error_11 = _a.sent();
                console.error('Erreur lors de la récupération de l historique :', error_11);
                res.status(500).json({ error: 'Erreur lors de la récupération de l historique.' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=app.js.map