const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options:{
        encrypt: false,
        trustServerCertificate: true
    },
    port: 1433
};
sql.connect(config).then(() => {
    console.log("Connected to mssql");
}).catch(err => {
    console.log("Lỗi:::", err);
})

module.exports = sql;