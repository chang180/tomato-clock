import type { NextConfig } from "next";

/** GitHub Pages 專案頁網址：https://<user>.github.io/<repo>/ */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/tomato-clock";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(isGithubPages && {
    basePath: repoBasePath,
    assetPrefix: `${repoBasePath}/`,
  }),
};

export default nextConfig;
