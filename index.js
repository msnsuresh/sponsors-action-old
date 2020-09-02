const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = process.env["GITHUB_TOKEN"];

    if (!token) {
      throw "Token not found";
    }

    console.log("token ", token);

    const octokit = new github.GitHub(token);
    const nwo = process.env["GITHUB_REPOSITORY"] || "/";
    const [owner, repo] = nwo.split("/");
    console.log(nwo);

    const readme = await octokit.request(`GET /repos/${owner}/${repo}/readme`, {
      headers: {
        authorization: `token ${token}`,
      },
    });

    if (readme.headers.status === "404") {
      console.log("readme not added");
      return;
    }

    console.log("readme ", readme);

    const sponsors_list = await octokit.request(
      `GET /repos/${owner}/${repo}/sponsors`,
      {
        headers: {
          authorization: `token ${token}`,
        },
      }
    );

    if (sponsors_list.headers.status === "404") {
      console.log("sponsors files not added");
      return;
    }

    console.log("sponsors_list ", sponsors_list);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
