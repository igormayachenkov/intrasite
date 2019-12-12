"use strict"
const fs = require("fs");

//----------------------------------------------------------------
// IMAGE GALLERY based on the file structure
// Each "gallery folder" contains:
//   [thumbnails]  - subfolder with small image files
//   image files

const rootFolder = '/home/igor/intrasite_history/';
//const rootFolder = __dirname+'/files/history/';


//----------------------------------------------------------------
// FOLDERS LIST
const folders = async function(r){
    // let dirs = []
    // let files = fs.readdirSync(rootFolder)
    // files.forEach(file=>{
    //    	// Read the file parameters
    //     let stat = fs.lstatSync(rootFolder+file);
    //     if(stat.isDirectory())
    //         dirs.push(file)
    // });

    let db = r._db;
    let results = await db.query('SELECT * from gallery_folders ORDER BY name DESC');
    r.server.endWithSuccess(r,results);
}
//----------------------------------------------------------------
// FILES for the folder
const files = async function(r){
    if(!r.data) throw "request data is empty"
    if(!r.data.folder) throw "parameters folder is empty"
    let folder = r.data.folder;
    let files = fs.readdirSync(rootFolder+folder)
    r.server.endWithSuccess(r, 
        files.filter(file => file!='thumbnails')
    );
}

//----------------------------------------------------------------
// ROUTER
exports.router = {
    $title: "History",
    $descr: "Load/modify image gallery",
    folders:{
        h_get:{
            title:"Folders",
            descr:"Load folders as a tree",
            action: folders
        }
    },
    files:{
        h_post:{
            title:"Files",
            descr:"Files for the folder",
            testBody: {folder:"111215"},
            requestBodyType: "json",            
            action: files
        }
    }
}
