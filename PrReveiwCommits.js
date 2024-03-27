const fs = require("fs");
const { Octokit } = require("@octokit/core");

const fileData = fs.readFileSync("filtered_pull_request_data.json", "utf-8");
const pullRequests = JSON.parse(fileData);

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
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
    return filteredData;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

const processAllData = async () => {
  try {
    const promises = pullRequests.map(fetchData);
    const results = await Promise.all(promises);
    const flattenedResults = results.flat();
    fs.writeFileSync(
      "tree_values.json",
      JSON.stringify(flattenedResults, null, 2)
    );
    console.log("Data processing completed successfully.");
  } catch (error) {
    console.error("Error processing data:", error.message);
  }
};

processAllData();
