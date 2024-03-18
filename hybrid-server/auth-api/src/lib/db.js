"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisePool = void 0;
var mysql = require("mysql2/promise");
var promisePool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
exports.promisePool = promisePool;
