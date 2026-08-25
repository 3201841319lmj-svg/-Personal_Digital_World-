import type { NextConfig } from "next";

const requestedOutput = process.env.NEXT_OUTPUT;

const nextConfig: NextConfig = {
  agentRules: false,
  output:
    requestedOutput === "standalone" || requestedOutput === "export"
      ? requestedOutput
      : undefined,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
