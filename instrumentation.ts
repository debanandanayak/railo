export async function register() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_MSW_ENABLED === "true" &&
    process.env.NEXT_RUNTIME === "nodejs"
  ) {
    const { startServerMocks } = await import("./mocks/server");
    startServerMocks();
  }
}
