const fs = require("fs");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const fetchData = async () => {
  try {
    // Read the "tree_values.json" file
    const treeValuesData = fs.readFileSync("tree_values.json", "utf-8");
    const treeValues = JSON.parse(treeValuesData);

    const fetchTree = async (commit) => {
      try {
        const response = await octokit.request(
          "GET /repos/{owner}/{repo}/commits/{ref}",
          {
            owner: "electron",
            repo: "electron",
            ref: commit.commit,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        const commitData = response.data;
        return commitData;
      } catch (error) {
        console.error(
          `Error fetching tree data for commit ${commit.commit}:`,
          error.message
        );
        return null;
      }
    };

    const allCommitData = await Promise.all(
      treeValues.map((commit) => fetchTree(commit))
    );

    fs.writeFileSync(
      "all_commit_data.json",
      JSON.stringify(
        allCommitData.filter((commitData) => commitData !== null),
        null,
        2
      )
    );
    console.log("Data processing completed successfully.");
  } catch (error) {
    console.error("Error reading tree_values.json:", error.message);
  }
};

fetchData();
