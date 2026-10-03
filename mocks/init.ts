export const mocksEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_MSW_ENABLED === "true";

let initialization: Promise<void> | undefined;

export async function initMocks() {
  if (!mocksEnabled || typeof window === "undefined") {
    return;
  }

  // Share startup across mounts, including React Strict Mode's effect replay.
  initialization ??= import("./browser")
    .then(async ({ worker }) => {
      await worker.start({ onUnhandledFrame: "bypass" });
    })
    .catch((error: unknown) => {
      initialization = undefined;
      throw error;
    });

  return initialization;
}
