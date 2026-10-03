"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { moshimoBookAffiliates, type MoshimoBookProduct } from "@/data/book-affiliates";
import { trackEvent } from "@/lib/analytics";

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

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const markLinks = () => {
      for (const link of wrapper.querySelectorAll("a")) {
        const rel = new Set(link.rel.split(/\s+/).filter(Boolean));
        for (const value of ["sponsored", "nofollow", "noopener", "noreferrer"]) rel.add(value);
        link.rel = [...rel].join(" ");
      }
    };

    markLinks();
    const observer = new MutationObserver(markLinks);
    observer.observe(wrapper, { childList: true, subtree: true });

    // 毎回の表示で発行コードを実行する。Next.js のクライアント遷移で戻った時もカードを再描画できる。
    if (!wrapper.dataset.moshimoInitialized) {
      wrapper.dataset.moshimoInitialized = "true";
      const script = document.createElement("script");
      script.textContent = makeEmbedScript(book.card);
      document.body.appendChild(script);
    }

    return () => observer.disconnect();
  }, [book]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    const link = target instanceof Element ? target.closest("a") : null;
    if (!link || !event.currentTarget.contains(link)) return;

    trackEvent("affiliate_outbound_click", {
      service_id: "moshimo",
      product_id: book.productId,
      retailer: link.textContent?.includes("Amazon") ? "amazon" : "rakuten",
      source_page: "semiconductor-market-cap-ranking",
      cta_location: "industry_map_books",
    });
  }

  return (
    <div className="guide-moshimo-book-link" onClick={handleClick} ref={wrapperRef}>
      <p>広告・アフィリエイトリンクです。購入されると運営者に報酬が入る場合があります。</p>
      <div id={`msmaflink-${book.id}`}>{book.title}の購入先を読み込んでいます。</div>
    </div>
  );
}
