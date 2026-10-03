import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.32"],
  reactCompiler: true,
  // Keep MSW's Node.js interceptors outside Turbopack's server bundles.
  serverExternalPackages: ["msw", "@mswjs/interceptors"],
};

export default async function config(phase: string) {
  if (
    phase === PHASE_DEVELOPMENT_SERVER &&
    process.env.NEXT_PUBLIC_MSW_ENABLED === "true"
  ) {
    // Next.js restores its initial fetch reference during server hot reloads.
    // Start MSW before that reference is captured so mocks survive edits.
    const { startServerMocks } = await import("./mocks/server.ts");
    startServerMocks();
  }

  return nextConfig;
}
