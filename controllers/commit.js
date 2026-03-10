const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(args) {

    const message = args.message;
    const rootPath = process.cwd();

    const repoPath = path.join(rootPath, ".CommitHub");
    const stagingPath = path.join(repoPath, "staging");
    const commitsPath = path.join(repoPath, "commits");
    const branchesPath = path.join(repoPath, "branches");
    const headPath = path.join(repoPath, "HEAD");

    try {

        // Check repo exists
        await fs.access(repoPath);

        const files = await fs.readdir(stagingPath);

        if (files.length === 0) {
            console.log("Nothing to commit!");
            return;
        }

        
        const currentBranch = (await fs.readFile(headPath, "utf-8")).trim();

        let parent = null;
        const branchFilePath = path.join(branchesPath, currentBranch);

        try {
            parent = (await fs.readFile(branchFilePath, "utf-8")).trim();
            if (parent === "") parent = null;
        } catch {
            parent = null;
        }

        // Create commit
        const commitId = uuidv4();
        const commitDir = path.join(commitsPath, commitId);

        await fs.mkdir(commitDir);

        for (const file of files) {
            await fs.copyFile(
                path.join(stagingPath, file),
                path.join(commitDir, file)
            );
        }

        const commitData = {
            id: commitId,
            message: message,
            parent: parent,
            date: new Date().toISOString()
        };

        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify(commitData, null, 2)
        );

        // Update branch pointer
        await fs.writeFile(branchFilePath, commitId);

        // Clear staging
        for (const file of files) {
            await fs.unlink(path.join(stagingPath, file));
        }
        console.log(commitData);
        console.log(`Commit ${commitId} created successfully.`);

    } catch (err) {
        console.error("Error during commit:", err.message);
    }
}

module.exports = { commitRepo };