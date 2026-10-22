export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server logs only: no public diagnostics endpoint or environment dump.
    console.info(`[runtime] Node.js ${process.version}`);
  }
}
