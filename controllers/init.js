const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
   const rootPath = process.cwd();
   const repoPath = path.join(rootPath, ".CommitHub");

   const commitPath = path.join(repoPath, "commits");
   const stagingPath = path.join(repoPath, "staging");
   const branchPath = path.join(repoPath, "branches");

   try {
      // Prevent re-init
      const exists = await fs.stat(repoPath).catch(() => null);
      if (exists) {
         console.log("Repository already initialized");
         return;
      }

      // Create main folder
      await fs.mkdir(repoPath, { recursive: true });

      // Subfolders
      await fs.mkdir(commitPath, { recursive: true });
      await fs.mkdir(stagingPath, { recursive: true });
      await fs.mkdir(branchPath, { recursive: true });

      // FIXED HEAD
      await fs.writeFile(
         path.join(repoPath, "HEAD"),
         "ref: refs/heads/main"
      );

      // Default branch
      await fs.writeFile(
         path.join(branchPath, "main"),
         ""
      );

      // Config
      await fs.writeFile(
         path.join(repoPath, "config.json"),
         JSON.stringify({
            author: null,
            currentBranch: "main",
            remotes: {}
         }, null, 2)
      );

      console.log("Repository initialized successfully");
   } catch (err) {
      console.error("Error while initializing:", err.message);
   }
}

module.exports = { initRepo };