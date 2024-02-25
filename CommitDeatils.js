const fs = require("fs");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: "TOKEN",
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

        const CommitData = response.data;
        fs.writeFileSync(
          "commit_data.json",
          JSON.stringify(CommitData, null, 2)
        );
      } catch (error) {
        console.error(
          `Error fetching tree data for commit ${commit.commit}:`,
          error.message
        );
      }
    };

    // Use Promise.all to make multiple asynchronous calls concurrently
    await Promise.all(treeValues.map((commit) => fetchTree(commit)));
  } catch (error) {
    console.error("Error reading tree_values.json:", error.message);
  }
};

// Call the asynchronous function
fetchData();
