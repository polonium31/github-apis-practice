const fs = require("fs");
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function getDocChangesPullRequests() {
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
        return pullRequest.title.toLowerCase().includes("docs:");
      })
      .map((pullRequest) => ({
        number: pullRequest.number,
        commits_url: pullRequest.commits_url,
      }));

    fs.writeFileSync(
      "filtered_doc_changes_pull_requests.json",
      JSON.stringify(filteredData, null, 2)
    );
  } catch (error) {
    console.error(
      "Error fetching pull requests with doc changes:",
      error.message
    );
  }
}

getDocChangesPullRequests();
