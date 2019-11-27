"use strict"

//////////////////////////////////////////////////////////////////////////////
// DATABASE INFO

const database = async function(r){
    let db = r._db;
    // Collect tables
    let results = await db.query('SHOW TABLE STATUS');
    r.server.endWithSuccess(r,{
        database: db.getDatabaseName(),
        table_status: results
    });
}

exports.router = {
    database:{
        h_get:{
            title:"Database",
            descr:"Database info",
            action: database
        }
    }
}