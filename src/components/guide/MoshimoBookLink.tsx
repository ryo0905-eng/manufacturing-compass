"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { moshimoBookAffiliates, type MoshimoBookProduct } from "@/data/book-affiliates";
import { getBookRetailer, observeBookAffiliate, type BookAffiliateAction, type BookAffiliateStatus } from "@/lib/book-affiliates";
import { trackEvent } from "@/lib/analytics";
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

export function MoshimoBookLink({ product }: { product: MoshimoBookProduct }) {
  const book = moshimoBookAffiliates[product];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<BookAffiliateStatus>("loading");
  const seen = useRef(new Set<BookAffiliateAction>());

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const record = (action: BookAffiliateAction) => {
      if (seen.current.has(action)) return;
      seen.current.add(action);
      try {
        trackEvent("book_affiliate_state", {
          action, product_id: book.productId, source_page: "semiconductor-market-cap-ranking",
          cta_location: "industry_map_books", ui_version: "books-v1",
        });
      } catch { /* An unavailable analytics service must not interrupt the card. */ }
    };
    const stop = observeBookAffiliate(wrapper, product, setStatus, record);

    // 毎回の表示で発行コードを実行する。Next.js のクライアント遷移で戻った時もカードを再描画できる。
    if (!wrapper.dataset.moshimoInitialized) {
      wrapper.dataset.moshimoInitialized = "true";
      const script = document.createElement("script");
      script.textContent = makeEmbedScript(book.card);
      document.body.appendChild(script);
    }

    return stop;
  }, [book, product]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    const link = target instanceof Element ? target.closest("a") : null;
    if (!link || !event.currentTarget.contains(link)) return;
    const retailer = getBookRetailer(link.getAttribute("href") ?? "", product);
    if (retailer === null) return;
    try {
      trackEvent("affiliate_outbound_click", {
        service_id: "moshimo", product_id: book.productId, retailer,
        source_page: "semiconductor-market-cap-ranking", cta_location: "industry_map_books", ui_version: "books-v1",
      });
    } catch { /* Keep the original purchase link usable. */ }
  }

  return (
    <article className={styles.card} aria-labelledby={`book-title-${book.id}`} data-book-product={product} data-book-status={status}>
      <h3 className={styles.title} id={`book-title-${book.id}`}>{book.title}</h3>
      <p className={styles.description}>{book.description}</p>
      <p className={styles.purpose}>{book.purpose}</p>
      <p className={styles.note}>広告・アフィリエイトリンクです。購入されると運営者に報酬が入る場合があります。</p>
      <p className={styles.note}>Amazonは書名の検索結果が開きます。購入前に2027年版であることをご確認ください。</p>
      <div className={`${styles.embed} ${status === "slow" ? styles.slow : ""}`} onClickCapture={handleClick} ref={wrapperRef}>
        <div id={`msmaflink-${book.id}`}><span className={styles.loading}>購入先を読み込んでいます。</span></div>
      </div>
      {status === "slow" && <div className={styles.status} role="status">
        <p>購入先の読み込みに時間がかかっています。通信環境やブラウザの設定をご確認ください。</p>
        <button type="button" onClick={() => window.location.reload()}>ページを再読み込み</button>
      </div>}
      <noscript><p className={styles.note}>購入先の表示にはJavaScriptが必要です。</p></noscript>
    </article>
  );
}
