import type { homeToolIds } from "@/data/home";

export function HomeToolPreview({ id }: { id: typeof homeToolIds[number] }) {
  return (
    <figure className="home-focused__tool-preview">
      <svg viewBox="0 0 300 100" aria-hidden="true" focusable="false">
        {id === "process-comparison" && <>
          <path className="home-preview-axis" d="M20 80H280" />
          <path className="home-preview-reference" d="M25 80C55 80 55 25 95 25S135 80 170 80" />
          <path className="home-preview-series" d="M120 80C155 80 155 35 195 35S235 80 275 80" />
          <text x="85" y="17">A</text><text x="190" y="27">B</text>
        </>}
        {id === "cpk" && <>
          <path className="home-preview-axis" d="M20 80H280M50 22V80M250 22V80" />
          <path className="home-preview-series" d="M55 80C105 80 105 22 150 22S195 80 245 80" />
          <text x="28" y="15">下限規格</text><text x="226" y="15">上限規格</text>
        </>}
        {id === "yield-dashboard" && <>
          <rect className="home-preview-box" x="10" y="30" width="76" height="40" rx="4" />
          <rect className="home-preview-box" x="112" y="30" width="76" height="40" rx="4" />
          <rect className="home-preview-box" x="214" y="30" width="76" height="40" rx="4" />
          <path className="home-preview-series" d="M90 50H106M100 44L106 50L100 56M192 50H208M202 44L208 50L202 56" />
          <text x="48" y="54" textAnchor="middle">観察</text>
          <text x="150" y="54" textAnchor="middle">原因候補</text>
          <text x="252" y="54" textAnchor="middle">確認実験</text>
        </>}
      </svg>
      <figcaption>概念図</figcaption>
    </figure>
  );
}
