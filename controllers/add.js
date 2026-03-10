const fs = require('fs').promises;
const path = require("path");
const { fileURLToPath } = require('url');



async function addRepo(args){
    const rootPath = process.cwd();
    const repoPath = path.join(rootPath,".CommitHub");
    const stagingPath = path.join(repoPath,"staging");
    
    const fieltoAdd = path.basename(args);
    const sourcePath = path.join(rootPath,fieltoAdd);
    const destinationPath = path.join(stagingPath,fieltoAdd);
    
    try{
        // await fs.mkdir(stagingPath,{recursive:true})
        const fieltoAdd = path.basename(args);
        //check if .commithub exits
        await fs.access(repoPath);
        //check if file exits
        await fs.access(sourcePath);
        //copy file
        await fs.copyFile(sourcePath,destinationPath);
        console.log(`${fieltoAdd} added to staging .`);
        
    }catch(err){
        console.error("Error Adding file :",err.message);
    }
}

module.exports = {addRepo};