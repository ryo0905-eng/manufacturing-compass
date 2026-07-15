import type { Route } from "next";
import Link from "next/link";
import { MarketCapRankingTable } from "@/components/MarketCapRankingTable";
import { SalaryRankingTable } from "@/components/SalaryRankingTable";
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

        if (block.type === "career-bridge") {
          return (
            <figure className="guide-career-bridge" key={`career-bridge-${index}`}>
              <figcaption>{block.title}</figcaption>
              <div className="guide-career-bridge__labels" aria-hidden="true">
                <span>{block.currentLabel}</span>
                <span>{block.targetLabel}</span>
                <span>{block.nextLabel}</span>
              </div>
              <ol>
                {block.rows.map((row, rowIndex) => (
                  <li key={`${row.current}-${row.target}`}>
                    <div>
                      <small>{block.currentLabel}</small>
                      <span>{String(rowIndex + 1).padStart(2, "0")}</span>
                      <strong>{row.current}</strong>
                    </div>
                    <i aria-hidden="true">→</i>
                    <div className="guide-career-bridge__target">
                      <small>{block.targetLabel}</small>
                      <strong>{row.target}</strong>
                    </div>
                    <i aria-hidden="true">→</i>
                    <div className="guide-career-bridge__next">
                      <small>{block.nextLabel}</small>
                      <strong>{row.next}</strong>
                    </div>
                  </li>
                ))}
              </ol>
            </figure>
          );
        }

        if (block.type === "opportunity-ladder") {
          return (
            <figure className="guide-opportunity-ladder" key={`opportunity-ladder-${index}`}>
              <figcaption>
                <strong>{block.title}</strong>
                <span>{block.description}</span>
              </figcaption>
              <ol>
                {block.items.map((item, itemIndex) => (
                  <li key={`${item.label}-${item.requirement}`}>
                    <div className="guide-opportunity-ladder__marker">
                      <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                      <i aria-hidden="true" />
                    </div>
                    <small>{item.label}</small>
                    <strong>{item.requirement}</strong>
                    <dl>
                      <div><dt>使用場面</dt><dd>{item.usage}</dd></div>
                      <div><dt>求人・職種例</dt><dd>{item.opportunity}</dd></div>
                    </dl>
                  </li>
                ))}
              </ol>
            </figure>
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

        if (block.type === "process-flow") {
          return (
            <figure className="guide-process-flow" key={`process-flow-${index}`}>
              <figcaption>
                <strong>{block.title}</strong>
                <span>{block.description}</span>
              </figcaption>
              <ol className="guide-process-flow__stages">
                {block.stages.map((stage, stageIndex) => (
                  <li key={`${stage.label}-${stage.title}`}>
                    <span>{stage.label}</span>
                    <strong>{stage.title}</strong>
                    <p>{stage.body}</p>
                    {stageIndex < block.stages.length - 1 ? <i aria-hidden="true">→</i> : null}
                  </li>
                ))}
              </ol>
              {block.cycle ? (
                <div className="guide-process-flow__cycle">
                  <strong>{block.cycle.title}</strong>
                  <ol>
                    {block.cycle.items.map((item, itemIndex) => (
                      <li key={item}><span>{String(itemIndex + 1).padStart(2, "0")}</span>{item}</li>
                    ))}
                  </ol>
                  <p>{block.cycle.note}</p>
                </div>
              ) : null}
            </figure>
          );
        }

        if (block.type === "layer-process") {
          return (
            <figure className="guide-layer-process" key={`layer-process-${index}`}>
              <figcaption>
                <strong>{block.title}</strong>
                <span>{block.description}</span>
              </figcaption>
              <ol>
                {block.stages.map((stage) => (
                  <li key={`${stage.label}-${stage.title}`}>
                    <span className="guide-layer-process__label">{stage.label}</span>
                    <strong>{stage.title}</strong>
                    <div className="guide-layer-process__visual" aria-hidden="true">
                      {stage.signal ? <span className="guide-layer-process__signal">{stage.signal}<i>↓ ↓ ↓</i></span> : null}
                      <div className="guide-layer-process__stack">
                        {stage.layers.map((layer, layerIndex) => (
                          <span
                            className={`guide-layer-process__layer guide-layer-process__layer--${layer.tone} guide-layer-process__layer--${layer.pattern ?? "solid"}`}
                            key={`${layer.label}-${layerIndex}`}
                          >
                            {layer.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p>{stage.body}</p>
                  </li>
                ))}
              </ol>
            </figure>
          );
        }

        if (block.type === "deposition-comparison") {
          return (
            <figure className="guide-deposition-comparison" key={`deposition-comparison-${index}`}>
              <figcaption>
                <strong>{block.title}</strong>
                <span>{block.description}</span>
              </figcaption>
              <ol>
                {block.methods.map((method) => (
                  <li className={`guide-deposition-comparison__method guide-deposition-comparison__method--${method.kind}`} key={method.kind}>
                    <span>{method.label}</span>
                    <strong>{method.title}</strong>
                    <div className="guide-deposition-comparison__visual" aria-hidden="true">
                      <i className="guide-deposition-comparison__source" />
                      <i className="guide-deposition-comparison__particles" />
                      <i className="guide-deposition-comparison__feature" />
                    </div>
                    <dl>
                      <div><dt>仕組み</dt><dd>{method.mechanism}</dd></div>
                      <div><dt>特徴</dt><dd>{method.characteristic}</dd></div>
                    </dl>
                  </li>
                ))}
              </ol>
            </figure>
          );
        }

        if (block.type === "market-cap-ranking") {
          return <MarketCapRankingTable key={`market-cap-ranking-${index}`} scope={block.scope} />;
        }

        if (block.type === "salary-ranking") {
          return <SalaryRankingTable key={`salary-ranking-${index}`} />;
        }

        if (block.type === "faq") {
          return (
            <dl className="guide-faq" key={`faq-${index}`}>
              {block.items.map((item) => (
                <div key={item.question}>
                  <dt>{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
          );
        }

        if (block.type === "links") {
          return (
            <nav className="guide-link-list" aria-label="関連ページ" key={`links-${index}`}>
              {block.items.map((item) => (
                <Link href={item.href as Route} key={item.href}>
                  <strong>{item.label}<span aria-hidden="true">→</span></strong>
                  <small>{item.description}</small>
                </Link>
              ))}
            </nav>
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
