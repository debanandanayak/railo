import { NetworkReadyState } from "msw/experimental";
import { setupServer } from "msw/node";
import { handlers } from "./handlers.ts";

// The config and instrumentation are loaded by different module loaders.
// Share one server so they never install competing network interceptors.
const globalForMocks = globalThis as typeof globalThis & {
  __betterRailMswServer?: ReturnType<typeof setupServer>;
};

globalForMocks.__betterRailMswServer ??= setupServer(...handlers);
export const server = globalForMocks.__betterRailMswServer;

export function startServerMocks() {
  if (server.readyState === NetworkReadyState.DISABLED) {
    server.listen({ onUnhandledFrame: "bypass" });
  }
}
