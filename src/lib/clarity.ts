export const CLARITY_PATH = "/guides/semiconductor-market-cap-ranking";
export const CLARITY_CONSENT_KEY = "mfg-clarity-consent-v1";
const CONSENT_TTL = 180 * 24 * 60 * 60 * 1000;

export type ClarityChoice = "granted" | "denied";
type ClarityCommand = (...args: unknown[]) => void;
type ClarityQueue = ClarityCommand & { q?: unknown[][] };
type ClarityWindow = Window & { clarity?: ClarityQueue };

export function isClarityPage(location: Pick<Location, "hostname" | "pathname" | "search">) {
  // Query-bearing URLs are excluded rather than transmitting arbitrary query values.
  return location.hostname === "mfg-compass.com" &&
    location.pathname === CLARITY_PATH && location.search === "";
}

export function readClarityChoice(storage: Pick<Storage, "getItem">, now = Date.now()): ClarityChoice | null {
  try {
    const value = JSON.parse(storage.getItem(CLARITY_CONSENT_KEY) ?? "null");
    if (!value || !Number.isFinite(value.expiresAt) || value.expiresAt <= now) return null;
    return value.choice === "granted" || value.choice === "denied" ? value.choice : null;
  } catch {
    return null;
  }
}

export function saveClarityChoice(storage: Pick<Storage, "setItem">, choice: ClarityChoice, now = Date.now()) {
  storage.setItem(CLARITY_CONSENT_KEY, JSON.stringify({ choice, expiresAt: now + CONSENT_TTL }));
}

/** Only called in the isolated ranking root layout. No script request before consent. */
export function loadClarity(projectId: string, win: ClarityWindow, doc: Document) {
  if (!/^[a-z0-9]+$/.test(projectId) || !isClarityPage(win.location)) return false;
  try {
    if (readClarityChoice(win.localStorage) !== "granted") return false;
  } catch {
    return false;
  }
  if (doc.getElementById("mfg-clarity")) return true;
  const clarity: ClarityQueue = win.clarity ?? Object.assign(
    (...args: unknown[]) => { clarity.q?.push(args); },
    { q: [] as unknown[][] },
  );
  win.clarity = clarity;
  // Queue consent before inserting the vendor script. Advertising storage stays denied.
  clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
  const script = doc.createElement("script");
  script.id = "mfg-clarity";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  doc.head.appendChild(script);
  return true;
}

/** Denied consent alone can leave cookieless tracking running: also unload the document. */
export function revokeClarity(win: ClarityWindow, doc: Document) {
  try {
    win.clarity?.("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
    win.clarity?.("stop");
  } finally {
    for (const name of ["_clck", "_clsk"]) {
      for (const domain of ["", "; Domain=mfg-compass.com"]) {
        doc.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain}`;
      }
    }
    // The exclusion also protects withdrawal when localStorage is unavailable.
    win.location.replace(`${CLARITY_PATH}?clarity=off`);
  }
}
