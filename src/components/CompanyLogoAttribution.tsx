export function CompanyLogoAttribution({ includeWinbond = false }: { includeWinbond?: boolean }) {
  return (
    <small className="company-logo-attribution">
      ロゴ画像：<a href="https://companiesmarketcap.com/" target="_blank" rel="noopener noreferrer">CompaniesMarketCap</a>
      （<a href="https://companieslogo.com/" target="_blank" rel="noopener noreferrer">CompaniesLogo</a>由来）
      {includeWinbond && <>、<a href="https://www.winbond.com/hq/?__locale=en" target="_blank" rel="noopener noreferrer">Winbond公式サイト</a></>}。商標・著作権は各権利者に帰属します。
    </small>
  );
}
