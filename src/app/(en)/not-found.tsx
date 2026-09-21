import Link from "next/link";

export default function EnglishNotFound() {
  return <main className="page"><section className="page-hero">
    <h1>Page not found</h1>
    <p>This English page is not available.</p>
    <Link href="/" hrefLang="ja">Main site (Japanese)</Link>
  </section></main>;
}
