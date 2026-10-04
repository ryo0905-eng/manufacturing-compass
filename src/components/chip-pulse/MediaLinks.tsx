"use client";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import type { WatchDestination } from "@/lib/watch-types";
export function MediaLink({ href, articleId, action, children, className, destination, placement = "detail" }: { href: string; articleId: string; action: "article" | "source" | "background"; children: ReactNode; className?: string; destination?: WatchDestination; placement?: "brief" | "featured" | "explore" | "updates" | "detail" | "official" | "navigation" }) {
 const click = () => trackEvent("chip_pulse_read", { article_id: articleId.replace(/^article:/, ""), action, destination_type: destination ?? (action === "source" ? "source" : action === "article" ? "article" : "guide"), placement, ui_version: "topics-v1" });
 return href.startsWith("/") ? <Link href={href} onClick={click} className={className}>{children}</Link> : <a href={href} onClick={click} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}
export function ArticleView({ id }: { id: string }) {
 const viewed = useRef<string | null>(null);
 useEffect(() => { if (viewed.current !== id) { viewed.current = id; trackEvent("chip_pulse_article_view", { article_id: id, ui_version: "topics-v1" }); } }, [id]);
 return null;
}
