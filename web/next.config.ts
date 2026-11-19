import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true gera um site estático (pasta out/) servido em /<repo>,
 * ex.: https://thelsandroantunes.github.io/enp-web/
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/enp-web" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(pages && { output: "export", trailingSlash: true, images: { unoptimized: true } }),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
