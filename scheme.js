"use strict"
//---------------------------------------------------------
var schemes = {
    'positions': {},
    'people'   : {},
    'devices'  : {},
    'owners'   : {},
    'sessions' : {}
}

//------------------------------------------------------------------
exports.verifyDatabase = async function(db){
    let tables = await tableStatus(db);
    // create not existed tables
    for(let name in schemes){
        if(tables[name]){
            console.log('    '+name+': ',tables[name]);
        }else{
            throw 'The table "'+name+'" is not found';
        }
    }
}
const tableStatus = async function(db){
    // Collect tables
    let results = await db.query('SHOW TABLE STATUS');
    let tables = {};

    results.forEach(row => {
        tables[row.Name] = {
            rows            : row.Rows,
            data_length     : row.Data_length,
            avg_row_length  : row.Avg_row_length
        };
    });
    return tables;
}
