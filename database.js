"use strict"

const mysql = require('mysql');

module.exports = class Database {
    constructor(connection){
		this.connection = connection;
    }
    async connect(databaseName){
        this.connection = await connect(databaseName);
    }
    disconnect(){
        if(this.connection)
            this.connection.destroy();
    }
    getDatabaseName(){
        return (this.connection && this.connection.config)?this.connection.config.database:null;
    }

    // MySQL connection.query wrapped in Promise
    // return: results 
    async query(sql){
        const m = this;
        return new Promise(function(resolve,reject){
            m.connection.query(sql, function (error, results, fields) {
                if(error) reject(error);
                else resolve(results);
            });
        });
    }
    // return: results + fields
    async queryWithFields(sql){
        const m = this;
        return new Promise(function(resolve,reject){
            m.connection.query(sql, function (error, results, fields) {
                if(error) reject(error);
                else resolve({results:results, fields:fields});
            });
        });
    }
    
    async startTransaction(){
        const m = this;
        return new Promise(function(resolve,reject){
            m.connection.beginTransaction(function (error) {
                if(error) reject(error);
                else resolve();
            });
        });
    }
    async commit(){
        const m = this;
        return new Promise(function(resolve,reject){
            m.connection.commit(function (error) {
                if(error) reject(error);
                else resolve();
            });
        });
    }
    async rollback(){
        const m = this;
        return new Promise(function(resolve,reject){
            m.connection.rollback(function () {
                resolve();
            });
        });
    }
}

//---------------------------------------------------------
// CONNECT TO THE DATABASE
// Create the database in need
// uses:     
//      global.config.DATABASE
const connect = async function(database){
    return new Promise(async function(resolve, reject){
    // Copy database parameters
    let param = {};
    for(const key in config.DATABASE)
        param[key] = config.DATABASE[key];
    //param.database = database; 
    
    // Create db connection
    var connection = mysql.createConnection(param);
        connection.connect(function (error) {
            if (error) reject(error);
            else{       
                // Select database
                connection.config.database = database;
                let sqlUse = 'USE '+database
                connection.query(sqlUse, function (error) {
                    if(error){
                        if(error.code=='ER_BAD_DB_ERROR'){
                            let sqlCreate = 'CREATE DATABASE '+database+" character set UTF8 collate utf8_bin";
                            console.log('*** mysql> '+sqlCreate);
                            connection.query(sqlCreate, function (error, results, fields) {
                                if(error) reject(error);
                                else connection.query(sqlUse, function (error, results, fields) {
                                    if (error) reject(error);
                                    else resolve(connection);
                                });
                            });
                        }else reject(error);
                    }else resolve(connection);
                });
            }
        });
    });
}

