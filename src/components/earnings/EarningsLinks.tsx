"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function EarningsView({ companyId }: { companyId: string }) {
  useEffect(() => { trackEvent("earnings_detail_view", { company_id: companyId }); }, [companyId]);
  return null;
}

export function EarningsInternalLink({ href, companyId, destination, children, className }: {
  href: string; companyId?: string; destination: string; children: ReactNode; className?: string;
}) {
  return <Link href={href} className={className} onClick={() => trackEvent("earnings_related_click", { company_id: companyId ?? "all", destination })}>{children}</Link>;
}

export function EarningsSourceLink({ href, companyId, documentId, children, className }: {
  href: string; companyId: string; documentId: string; children: ReactNode; className?: string;
}) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("earnings_source_click", { company_id: companyId, document_id: documentId })}>{children}</a>;
}
