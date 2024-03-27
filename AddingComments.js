const fs = require("fs");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// const fetchData = async () => {
//   try {
//     const response = await octokit.request(
//       "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
//       {
//         owner: "electron",
//         repo: "electron",
//         pull_number: "41567",
//         body: "Great stuff!",
//         commit_id: "3dc57f7d4210218a4cbf7974fff20b66427e17f1",
//         path: "docs/development/build-instructions-gn.md",
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28",
//         },
//       }
//     );

//     const commitData = response.data;
//     fs.writeFileSync("comment_added.json", JSON.stringify(commitData, null, 2));
//     console.log("Review comment created successfully:", commitData);
//   } catch (error) {
//     console.error(`Error creating review comment:`, error.message);
//   }
// };
// fetchData();
const checkFileExistsInCommit = async (path) => {
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "electron",
        repo: "electron",
        path,
        ref: "3dc57f7d4210218a4cbf7974fff20b66427e17f1",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (response.status === 200) {
      console.log(`File ${path} exist`);
    }
  } catch (error) {
    if (error.status === 404) {
      console.log(`File ${path} not exist in the commit.`);
    } else {
      console.error(`Error checking file existence:`, error.message);
    }
  }
};

checkFileExistsInCommit("docs/development/build-instructions-gn.md");
