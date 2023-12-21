"use strict";
// sequelize.ts
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_typescript_1 = require("sequelize-typescript");
var sequelize = new sequelize_typescript_1.Sequelize({
    database: 'LearningFactDb_arti',
    username: 'learningDbUser_arti',
    password: '1234',
    host: 'localhost',
    dialect: 'postgres', // Le dialecte de la base de données
});
exports.default = sequelize;
//# sourceMappingURL=sequelize.js.map