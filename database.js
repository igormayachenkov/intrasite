"use strict"

const mysql = require('mysql');

//------------------------------------------------------------------------------
// DATABASE wit connection pooling
// options:
//      host
//      user
//      password
//      database
class Database {
    constructor(options){
        this.options = options
        this.pool = mysql.createPool(options);
    }
    disconnect(){
        this.pool.end();
    }

    getDatabaseName(){
        return this.pool.config.connectionConfig.database;
    }

    // MySQL connection.query wrapped in Promise
    // return: results 
    async query(sql){
        const pool = this.pool;
        return new Promise(function(resolve,reject){
            pool.query(sql, function (error, results, fields) {
                if(error) reject(error);
                else resolve(results);
            });
        });
    }
    // return: results + fields
    async queryWithFields(sql){
        const pool = this.pool;
        return new Promise(function(resolve,reject){
            pool.query(sql, function (error, results, fields) {
                if(error) reject(error);
                else resolve({results:results, fields:fields});
            });
        });
    }
    
    // returns the transaction object
    async startTransaction(){
        const pool = this.pool;
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err, connection) {
                if(err) reject(err);
                else connection.beginTransaction(function (error) {
                    if(error){
                        connection.release();
                        reject(error);
                    }
                    else resolve(new Transaction(connection));
                });
            });
        });
    }
}

//------------------------------------------------------------------------------
// TRANSACTION
// the connection must be:
//      - selected from the pool 
//      - withs started transaction
class Transaction {
    constructor(connection){
        this.connection = connection;
    }
    async commit(){
        const connection = this.connection;
        return new Promise(function(resolve,reject){
            connection.commit(function (error) {
                connection.release();
                if(error) reject(error);
                else resolve();
            });
        });
    }
    async rollback(){
        const connection = this.connection;
        return new Promise(function(resolve,reject){
            connection.rollback(function () {
                connection.release();
                resolve();
            });
        });
    }
}


exports.Database = Database;
exports.Transaction = Transaction;
