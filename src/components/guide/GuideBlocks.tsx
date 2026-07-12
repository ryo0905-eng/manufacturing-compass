import type { GuideBlock } from "@/content/guides/types";

type GuideBlocksProps = {
  blocks: GuideBlock[];
};

export function GuideBlocks({ blocks }: GuideBlocksProps) {
  return (
    <div className="guide-blocks">
      {blocks.map((block, index) => {
        if (block.type === "timeline") {
          return (
            <ol className="guide-storyline" key={`timeline-${index}`}>
              {block.items.map((item) => (
                <li key={`${item.label}-${item.title}`}>
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "cards") {
          return (
            <div className={`guide-card-grid guide-card-grid--${block.columns ?? 3}`} key={`cards-${index}`}>
              {block.items.map((item) => (
                <article key={`${item.label}-${item.title}`}>
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  {item.body ? <p>{item.body}</p> : null}
                </article>
              ))}
            </div>
          );
        }

        if (block.type === "mapping") {
          return (
            <div className="guide-mapping" key={`mapping-${index}`}>
              <table>
                <thead>
                  <tr><th scope="col">{block.leftLabel}</th><th scope="col">{block.rightLabel}</th></tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={`${row.left}-${row.right}`}><th scope="row">{row.left}</th><td>{row.right}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote className="guide-pull-quote" key={`quote-${index}`}>
              <p>「{block.quote}」</p>
              {block.caption ? <cite>{block.caption}</cite> : null}
            </blockquote>
          );
        }

        return (
          <aside className="guide-note" key={`note-${index}`}>
            <strong>{block.title}</strong>
            <p>{block.body}</p>
          </aside>
        );
      })}
    </div>
  );
}
