const { argv } = require("yargs");
const fs = require("fs").promises;



async function pushRepo(argv){
    const remote = argv.remote;
    const branch = argv.branch;
    
    const rootPath = process.cwd();
    
    const repoPath = path.join(rootPath,".CommitHub");
    const stagingPath = path.join(repoPath,"staging");
    const branchesPath = path.join(repoPath,"branches");
    const commitsPath = path.join(repoPath,"commits");
    const headPath = path.join(repoPath,"HEAD");
    const pushPath = path.join(repoPath,)
    
    
};

module.exports = {pushRepo};