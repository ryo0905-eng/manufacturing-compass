'use client';

import { trackEvent } from '@/lib/analytics';

export function CompanySearchJump() {
  return (
    <a
      className="button primary companies-search-jump"
      href="#company-search"
      onClick={(event) => {
        try {
          trackEvent('industry_map_category_click', { category: 'company_search', destination: 'map_search', source_page: '/industry-map', ui_version: 'unified-atlas-v2' });
        } catch { /* Navigation also works when analytics is unavailable. */ }
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        // Native fragment navigation scrolls first; focus without scrolling again.
        requestAnimationFrame(() => document.getElementById('company-search')?.focus({ preventScroll: true }));
      }}
    >
      条件から企業を探す <span aria-hidden="true">↓</span>
    </a>
  );
}
