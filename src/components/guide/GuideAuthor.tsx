import Link from "next/link";

export function GuideAuthor({ name }: { name: string }) {
  return <>執筆・確認：{name === "RYO" ? <Link href="/about">{name}</Link> : name}</>;
}
