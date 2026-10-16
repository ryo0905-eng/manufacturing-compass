'use client';

import { trackEvent } from '@/lib/analytics';

export function CompanySearchJump() {
  return (
    <a
      className="button primary companies-search-jump"
      href="#company-search"
      onClick={(event) => {
        trackEvent('companies_search_jump', { placement: 'hero', ui_version: 'directory-visuals-v1' });
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        // Native fragment navigation scrolls first; focus without scrolling again.
        requestAnimationFrame(() => document.getElementById('company-search')?.focus({ preventScroll: true }));
      }}
    >
      条件から企業を探す <span aria-hidden="true">↓</span>
    </a>
  );
}
