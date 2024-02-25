const fs = require("fs");
const { Octokit } = require("@octokit/core");

const fileData = fs.readFileSync("filtered_pull_request_data.json", "utf-8");
const pullRequests = JSON.parse(fileData);

const octokit = new Octokit({
  auth: "TOKEN",
});

const fetchData = async (pullRequest) => {
  const { number } = pullRequest;
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
      {
        owner: "electron",
        repo: "electron",
        pull_number: number,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const filteredData = response.data.map((commit) => ({
      commit: commit.sha,
    }));
    fs.writeFileSync("tree_values.json", JSON.stringify(filteredData, null, 2));
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

for (const pullRequest of pullRequests) {
  fetchData(pullRequest);
}
