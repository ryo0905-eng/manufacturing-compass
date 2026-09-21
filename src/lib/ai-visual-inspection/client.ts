import { ASSET_ROOT } from "./protocol";
import type { InspectionRequest, InspectionResponse } from "./protocol";

type Complete = Extract<InspectionResponse, { status: "complete" }>;
/** UI must clear its AI result while awaiting this promise or after rejection. */
export class InspectionClient {
  private worker?: Worker;
  private sequence = 0;
  private pending?: { id: number; resolve: (value: Complete) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

  constructor(private readonly createWorker = () => new Worker(`${ASSET_ROOT}/inference.worker.js`, { type: "module" })) {}

  inspect(input: Omit<InspectionRequest, "id">): Promise<Complete> {
    this.cancel();
    try {
      if (!this.worker) {
        this.worker = this.createWorker();
        this.worker.onmessage = (event: MessageEvent<InspectionResponse>) => {
          const response = event.data;
          const pending = this.pending;
          if (!pending || response.id !== pending.id) return;
          clearTimeout(pending.timer);
          this.pending = undefined;
          if (response.status === "complete") pending.resolve(response);
          else pending.reject(new Error("AIを評価できませんでした。再試行してください。"));
        };
        this.worker.onerror = () => this.fail();
        this.worker.onmessageerror = () => this.fail();
      }
      const id = ++this.sequence;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => this.fail(), 60000);
        this.pending = { id, resolve, reject, timer };
        // Clone pixels; never detach display buffers or include evaluation labels.
        try { this.worker!.postMessage({ id, images: input.images.map(({ width, height, pixels }) => ({ width, height, pixels })), settings: input.settings }); }
        catch { this.fail(); }
      });
    } catch { return Promise.reject(new Error("この環境ではAIを起動できません。")); }
  }

  private cancel() {
    if (this.pending) {
      clearTimeout(this.pending.timer);
      this.pending.reject(new DOMException("新しい操作に切り替えました。", "AbortError"));
      this.pending = undefined;
    }
  }

  private fail() {
    if (this.pending) {
      clearTimeout(this.pending.timer);
      this.pending.reject(new Error("AIを評価できませんでした。再試行してください。"));
      this.pending = undefined;
    }
    this.dispose();
  }

  dispose() {
    this.cancel();
    this.worker?.terminate();
    this.worker = undefined;
  }
}
