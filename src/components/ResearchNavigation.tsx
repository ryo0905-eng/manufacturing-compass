import type { ReactNode } from "react";
import type { Route } from "next";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { researchPages, type ResearchDestination, type ResearchPageId } from "@/data/research-navigation";
import styles from "@/components/ResearchNavigation.module.css";

type ResearchNavigationLinkProps = {
  source: ResearchPageId;
  destination: ResearchDestination;
  action: "intro_link" | "related_link" | "quick_link";
  href: Route;
  className?: string;
  children: ReactNode;
};

export function ResearchNavigationLink({ source, destination, action, href, className, children }: ResearchNavigationLinkProps) {
  return (
    <TrackedInternalLink
      href={href}
      className={className}
      eventName="research_navigation_click"
      eventProperties={{ source_page: researchPages[source].href, destination, action, ui_version: "research-roles-v1" }}
    >
      {children}
    </TrackedInternalLink>
  );
}

export function ResearchNavigation({ page }: { page: ResearchPageId }) {
  return (
    <div className={styles.root}>
      <nav className={styles.quickLinks} aria-label="このページですぐ調べる">
        {researchPages[page].quickLinks.map((link) => (
          <ResearchNavigationLink key={link.destination} source={page} destination={link.destination} action="quick_link" href={link.href} className={styles.link}>
            {link.label}<span aria-hidden="true">↓</span>
          </ResearchNavigationLink>
        ))}
      </nav>
      <nav className={styles.alternatives} aria-label="別の調べ方">
        <p>別の調べ方</p>
        <div>
          {(Object.keys(researchPages) as ResearchPageId[]).filter((id) => id !== page).map((id) => (
            <ResearchNavigationLink key={id} source={page} destination={id} action="intro_link" href={researchPages[id].href} className={styles.link}>
              {researchPages[id].label}<span aria-hidden="true">→</span>
            </ResearchNavigationLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
