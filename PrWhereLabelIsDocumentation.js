const fs = require("fs");
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: "TOKEN",
});

async function getPullRequestsWithLabel() {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: "electron",
      repo: "electron",
      state: "open",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const filteredData = response.data
      .filter((pullRequest) => {
        const label = pullRequest.labels.find(
          (label) => label.name === "documentation :notebook:"
        );
        return label;
      })
      .map((pullRequest) => ({
        number: pullRequest.number,
        commits_url: pullRequest.commits_url,
      }));
    fs.writeFileSync(
      "filtered_pull_request_data.json",
      JSON.stringify(filteredData, null, 2)
    );
  } catch (error) {
    console.error("Error fetching labeled pull requests:", error.message);
  }
}

getPullRequestsWithLabel();
