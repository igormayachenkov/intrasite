"use strict"
//---------------------------------------------------------
const id          = 'id BIGINT NOT NULL';
const time        = 'time BIGINT NOT NULL';
const _mt         = '_mt BIGINT NOT NULL';
const primary_key = 'PRIMARY KEY (id,time)';
var schemes = {
    'positions': 'id INT NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY(id)',
    'people'   : 'id INT NOT NULL, name VARCHAR(150) NOT NULL, position INT, PRIMARY KEY(id)'
}
const populate = {
    'positions' : ['1, "sysadmin"',
                   '2, "programmer"'],
    'people'    : ['1, "Ivanov", 1',
                   '2, "Petrov", 2',
                   '3, "Sidorov",2']
}

//------------------------------------------------------------------
exports.verifyDatabase = async function(db){
    let tables = await tableStatus(db);
    // create not existed tables
    for(let name in schemes){
        if(tables[name]){
            console.log('    '+name+': ',tables[name]);
        }else{
            let sqlCreate = 'CREATE TABLE '+name+' ('+schemes[name]+')';
            console.log('*** mysql> '+sqlCreate);
            await db.query(sqlCreate);
            // Populate 
            let popList = populate[name];
            if(popList)
                popList.forEach((data)=>{
                    let sqlInsert = 'INSERT INTO  '+name+' VALUES('+data+')';
                    console.log('*** mysql> '+sqlInsert);
                    db.query(sqlInsert);
                })
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
