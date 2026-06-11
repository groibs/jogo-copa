import type { NextConfig } from "next";

// Build para GitHub Pages: DEPLOY_TARGET=pages npm run build
// Gera export estático em ./out com basePath /jogo-copa.
// Sem a variável, nada muda no fluxo local (dev/build/start).
const isGitHubPages = process.env.DEPLOY_TARGET === "pages";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath: "/jogo-copa",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
