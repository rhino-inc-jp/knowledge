const fs = require("fs");

const branch = process.env.DEPLOY_PRIME_BRANCH || process.env.HEAD || "unknown";

const content =
  branch === "main" ? `User-agent: *\nAllow: /` : `User-agent: *\nDisallow: /`;

fs.writeFileSync("public/robots.txt", content);

console.log(`[robots.txt] Generated for branch: ${branch}`);
