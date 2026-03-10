const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
   
   const rootPath = process.cwd();
   const repoPath = path.join(rootPath,".CommitHub");
   
   const commitPath = path.join(repoPath,"commits");
   const stagingPath = path.join(repoPath,"staging");
   const branchPath = path.join(repoPath,"branches");
   
   try{
      //mine main folder
      await fs.mkdir(repoPath,{ recursive: true});
      
      //subfolders of the main
      await fs.mkdir(commitPath,{ recursive: true});
      await fs.mkdir(stagingPath,{ recursive: true });
      await fs.mkdir(branchPath,{ recursive: true });
      
      //head
      await fs.writeFile(
         path.join(repoPath,"HEAD"), 
         "main"
      )
      
   //main brach as deafult
      await fs.writeFile(
         path.join(branchPath,"main"),
         ""
      )
      
      await fs.writeFile(
         path.join(repoPath,"config.json"),
         JSON.stringify({ 
            bucket:process.env.S3_BUCKET,
            currentBranch: "main",
            remotes: {}
         },null,2)
      )
      console.log("Repository Intialized successfully");
   }catch(err){
      console.error("Error while initializing : ",err.message);
   }
   
   
}


module.exports = {initRepo};