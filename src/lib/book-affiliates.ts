import { moshimoBookAffiliates, type MoshimoBookProduct } from "@/data/book-affiliates";
import { observeVisibleOnce } from "@/lib/observe-visible";

export type BookRetailer = "amazon" | "rakuten" | "unknown";
export type BookAffiliateAction = "section_view" | "ready" | "view" | "unavailable";
export type BookAffiliateStatus = "idle" | "loading" | "ready" | "slow";

/** Recognize this card's purchase links without inferring a shop from visible text. */
export function getBookRetailer(href: string, product: MoshimoBookProduct): BookRetailer | null {
  let url: URL;
  try { url = new URL(href, "https://mfg-compass.com"); } catch { return null; }
  if (url.protocol !== "https:") return null;
  const links = moshimoBookAffiliates[product].card.b_l;
  const direct = links.find(link => new URL(link.u_url).href === url.href);
  if (direct) return direct.s_n;
  if (url.hostname !== "af.moshimo.com" || url.pathname.replace(/\/$/, "") !== "/af/c/click") return null;
  const account = url.searchParams.get("a_id");
  if (!links.some(link => String(link.a_id) === account)) return null;
  return links.find(link => String(link.a_id) === account && String(link.p_id) === url.searchParams.get("p_id"))?.s_n ?? "unknown";
}

/** Observe generated purchase links, including recovery after a slow/failed load. */
export function observeBookAffiliate(
  target: HTMLElement,
  product: MoshimoBookProduct,
  onStatus: (status: BookAffiliateStatus) => void,
  onAction: (action: BookAffiliateAction) => void,
) {
  let disposed = false;
  let ready = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopVisibility: (() => void) | undefined;
  const startTimer = () => setTimeout(() => {
    if (disposed) return;
    onStatus("slow");
    onAction("unavailable");
  }, 10_000);
  const check = () => {
    if (disposed) return;
    let hasPurchase = false;
    for (const link of target.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      if (getBookRetailer(link.getAttribute("href") ?? "", product) === null) continue;
      hasPurchase = true;
      const rel = new Set(link.rel.split(/\s+/).filter(Boolean));
      for (const value of ["sponsored", "nofollow", "noopener", "noreferrer"]) rel.add(value);
      link.rel = [...rel].join(" ");
    }
    if (hasPurchase === ready) return;
    ready = hasPurchase;
    clearTimeout(timer);
    stopVisibility?.();
    if (ready) {
      onStatus("ready");
      onAction("ready");
      stopVisibility = observeVisibleOnce(target, () => onAction("view"));
    } else {
      onStatus("loading");
      timer = startTimer();
    }
  };
  timer = startTimer();
  const observer = new MutationObserver(check);
  // Some embeds add an anchor before assigning its href; attributes matter too.
  observer.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
  check();
  return () => { disposed = true; clearTimeout(timer); observer.disconnect(); stopVisibility?.(); };
}
