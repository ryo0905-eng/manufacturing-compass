"use client";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
export function MediaLink({ href, articleId, action, children, className }: { href: string; articleId: string; action: "article" | "source" | "background"; children: ReactNode; className?: string }) {
 const click = () => trackEvent("chip_pulse_read", { article_id: articleId, action });
 return href.startsWith("/") ? <Link href={href} onClick={click} className={className}>{children}</Link> : <a href={href} onClick={click} className={className} target="_blank" rel="noreferrer">{children}</a>;
}
export function ArticleView({ id }: { id: string }) {
 useEffect(() => { trackEvent("chip_pulse_article_view", { article_id: id }); }, [id]);
 return null;
}

