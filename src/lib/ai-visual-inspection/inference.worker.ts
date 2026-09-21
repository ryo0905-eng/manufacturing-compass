import { InspectionRuntime } from "./runtime.js";
import type { InspectionRequest, InspectionResponse } from "./protocol.js";

const runtime = new InspectionRuntime();
let latest = 0;
let pending: InspectionRequest | undefined;
let running = false;
const reply = (message: InspectionResponse) => self.postMessage(message);
self.onmessage = (event: MessageEvent<InspectionRequest>) => {
  latest = event.data.id;
  pending = event.data;
  void drain();
};
async function drain() {
  if (running) return;
  running = true;
  try {
    while (pending) {
      const request = pending;
      pending = undefined;
      try {
        const result = await runtime.evaluate(request, () => latest === request.id);
        if (result) reply({ id: request.id, status: "complete", ...result });
      } catch {
        if (latest === request.id) reply({ id: request.id, status: "error", code: "inspection-failed" });
      }
    }
  } finally { running = false; }
}
