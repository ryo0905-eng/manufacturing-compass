"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type IndustryDirectoryCollection = {
  id: string;
  label: string;
  description: string;
  guides: Array<{
    slug: string;
    shortTitle: string;
    title: string;
    description: string;
    readTime: string;
    updatedAt: string;
  }>;
};

type IndustryGuideDirectoryProps = {
  collections: IndustryDirectoryCollection[];
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export function IndustryGuideDirectory({ collections }: IndustryGuideDirectoryProps) {
  const [query, setQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const normalizedQuery = query.trim().toLocaleLowerCase("ja");

  const visibleCollections = useMemo(
    () => collections
      .filter((collection) => selectedCollection === "all" || collection.id === selectedCollection)
      .map((collection) => ({
        ...collection,
        guides: collection.guides.filter((guide) => {
          if (!normalizedQuery) return true;
          return `${guide.shortTitle} ${guide.title} ${guide.description}`
            .toLocaleLowerCase("ja")
            .includes(normalizedQuery);
        }),
      }))
      .filter((collection) => collection.guides.length > 0),
    [collections, normalizedQuery, selectedCollection],
  );

  const resultCount = visibleCollections.reduce(
    (count, collection) => count + collection.guides.length,
    0,
  );

  return (
    <section className="industry-directory" aria-labelledby="industry-directory-title">
      <header className="industry-directory__tools">
        <div>
          <p className="section-label">Article directory</p>
          <h2 id="industry-directory-title">キーワードとテーマから探す</h2>
        </div>
        <label className="industry-directory__search">
          <span>企業名・装置名・材料名</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例：洗浄、KLA、真空"
            type="search"
            value={query}
          />
        </label>
      </header>

      <div className="industry-directory__filters" aria-label="記事テーマ">
        <button
          aria-pressed={selectedCollection === "all"}
          onClick={() => setSelectedCollection("all")}
          type="button"
        >
          すべて
        </button>
        {collections.map((collection) => (
          <button
            aria-pressed={selectedCollection === collection.id}
            key={collection.id}
            onClick={() => setSelectedCollection(collection.id)}
            type="button"
          >
            {collection.label}
          </button>
        ))}
      </div>

      <p className="industry-directory__count" aria-live="polite">{resultCount}記事を表示</p>

      {visibleCollections.length > 0 ? (
        <div className="industry-directory__groups">
          {visibleCollections.map((collection) => (
            <section className="industry-directory__group" id={`collection-${collection.id}`} key={collection.id}>
              <header>
                <div>
                  <h3>{collection.label}</h3>
                  <p>{collection.description}</p>
                </div>
                <span>{collection.guides.length}記事</span>
              </header>
              <div className="industry-directory__list">
                {collection.guides.map((guide) => (
                  <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                    <div>
                      <strong>{guide.shortTitle}</strong>
                      <p>{guide.description}</p>
                    </div>
                    <footer>
                      <span>{guide.readTime}</span>
                      <time dateTime={guide.updatedAt}>更新 {formatDate(guide.updatedAt)}</time>
                      <i aria-hidden="true">→</i>
                    </footer>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="industry-directory__empty">
          <strong>該当する記事がありませんでした</strong>
          <p>企業名を短くするか、「検査」「真空」のような装置・工程名で検索してみてください。</p>
        </div>
      )}
    </section>
  );
}
