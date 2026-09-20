"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import type { HomePurpose, HomeSection } from "@/data/home";
import { trackEvent } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  section: HomeSection;
  destination: string;
  purpose: HomePurpose;
};

export function HomeLink({ section, destination, purpose, onClick, ...props }: Props) {
  return <Link {...props} onClick={(event) => {
    trackEvent("home_link_click", {
      section_id: section,
      destination_id: destination,
      purpose,
      version: "purpose-entry-v1",
    });
    onClick?.(event);
  }} />;
}
