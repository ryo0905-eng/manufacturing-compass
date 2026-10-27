"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { moshimoBookAffiliates, type MoshimoBookProduct } from "@/data/book-affiliates";
import { getBookRetailer, observeBookAffiliate, type BookAffiliateAction, type BookAffiliateStatus } from "@/lib/book-affiliates";
import { trackEvent } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";
import styles from "./MoshimoBookLink.module.css";

function makeEmbedScript(card: object) {
  return `
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","https://dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink(${JSON.stringify(card)});
`;
}

function makeEmbedDocument(id: string, card: object) {
  // The vendor renders only on DOMContentLoaded/load. A fresh document keeps
  // those events available even after scrolling or an App Router navigation.
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0}</style></head><body id="book-embed-${id}"><div id="msmaflink-${id}"></div><script>${makeEmbedScript(card)}</script></body></html>`;
}

export function MoshimoBookLink({ product }: { product: MoshimoBookProduct }) {
  const book = moshimoBookAffiliates[product];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<BookAffiliateStatus>("idle");
  const seen = useRef(new Set<BookAffiliateAction>());
  const cardRef = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const cardElement = cardRef.current;
    if (!wrapper || !cardElement) return;

    const record = (action: BookAffiliateAction) => {
      if (seen.current.has(action)) return;
      seen.current.add(action);
      try {
        trackEvent("book_affiliate_state", {
          action, product_id: book.productId, source_page: "semiconductor-market-cap-ranking",
          cta_location: "industry_map_books", ui_version: "books-v2",
        });
      } catch { /* An unavailable analytics service must not interrupt the card. */ }
    };
    let stopEmbed: (() => void) | undefined;
    let stopFrame: (() => void) | undefined;
    const initialize = () => {
      started.current = true;
      setStatus("loading");
      stopEmbed = observeBookAffiliate(wrapper, product, setStatus, record);

      const existing = wrapper.querySelector<HTMLIFrameElement>("iframe");
      const frame = existing ?? document.createElement("iframe");
      let stopResize: (() => void) | undefined;
      let stopClicks: (() => void) | undefined;
      const connect = () => {
        const body = frame.contentDocument?.body;
        // The vendor renames its own msmaflink element after rendering.
        if (!body || body.id !== `book-embed-${book.id}`) return;
        stopEmbed?.();
        stopEmbed = observeBookAffiliate(wrapper, product, setStatus, record, body);
        const resize = () => { frame.style.height = `${body.scrollHeight}px`; };
        resize();
        stopResize?.();
        if (typeof ResizeObserver !== "undefined") {
          const observer = new ResizeObserver(resize);
          observer.observe(body);
          stopResize = () => observer.disconnect();
        }
        stopClicks?.();
        const click = (event: Event) => handlePurchaseClick(event.target, body);
        body.addEventListener("click", click, true);
        stopClicks = () => body.removeEventListener("click", click, true);
      };
      frame.addEventListener("load", connect);
      if (existing) {
        connect();
      } else {
        frame.title = `${book.title}の購入先`;
        frame.className = styles.frame;
        frame.srcdoc = makeEmbedDocument(book.id, book.card);
        wrapper.appendChild(frame);
      }
      stopFrame = () => {
        frame.removeEventListener("load", connect);
        stopResize?.();
        stopClicks?.();
      };
    };
    const stopCardVisibility = seen.current.has("section_view") ? () => {} : observeVisibleOnce(cardElement, () => {
      record("section_view");
      if (!started.current) initialize();
    });

    // Older browsers still get purchase links, without fabricating section exposure.
    if (started.current || typeof IntersectionObserver === "undefined") initialize();

    return () => { stopCardVisibility(); stopEmbed?.(); stopFrame?.(); };
  }, [book, product]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    handlePurchaseClick(event.target, event.currentTarget);
  }

  function handlePurchaseClick(target: EventTarget | null, container: HTMLElement) {
    // iframe elements belong to another realm, so instanceof Element fails.
    const link = (target as Element | null)?.closest?.("a");
    if (!link || !container.contains(link)) return;
    const retailer = getBookRetailer(link.getAttribute("href") ?? "", product);
    if (retailer === null) return;
    try {
      trackEvent("affiliate_outbound_click", {
        service_id: "moshimo", product_id: book.productId, retailer,
        source_page: "semiconductor-market-cap-ranking", cta_location: "industry_map_books", ui_version: "books-v2",
      });
    } catch { /* Keep the original purchase link usable. */ }
  }

  return (
    <article className={styles.card} ref={cardRef} aria-labelledby={`book-title-${book.id}`} data-book-product={product} data-book-status={status}>
      <h3 className={styles.title} id={`book-title-${book.id}`}>{book.title}</h3>
      <p className={styles.description}>{book.description}</p>
      <p className={styles.purpose}>{book.purpose}</p>
      <p className={styles.note}>広告・アフィリエイトリンクです。購入されると運営者に報酬が入る場合があります。</p>
      <p className={styles.note}>Amazonは書名の検索結果が開きます。購入前に2027年版であることをご確認ください。</p>
      <div className={`${styles.embed} ${status === "slow" || status === "ready" ? styles.loaded : ""}`} onClickCapture={handleClick} ref={wrapperRef}>
        <div id={`msmaflink-${book.id}`}><span className={styles.loading}>{status === "idle" ? "購入先は、この紹介欄が表示されたときに読み込みます。" : "購入先を読み込んでいます。"}</span></div>
      </div>
      {status === "slow" && <div className={styles.status} role="status">
        <p>購入先の読み込みに時間がかかっています。通信環境やブラウザの設定をご確認ください。</p>
        <button type="button" onClick={() => window.location.reload()}>ページを再読み込み</button>
      </div>}
      <noscript><p className={styles.note}>購入先の表示にはJavaScriptが必要です。</p></noscript>
    </article>
  );
}
