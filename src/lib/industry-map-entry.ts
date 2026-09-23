/** Only known, actually rendered company nodes can be restored. */
export function readIndustryCompanyHash(hash: string, companyIds: readonly string[]): { kind: "anchor" } | { kind: "invalid" } | { kind: "company"; id: string } {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  if (!params.has("company")) return { kind: "anchor" };
  const id = params.get("company")!;
  if (params.getAll("company").length !== 1 || !companyIds.includes(id)) return { kind: "invalid" };
  return { kind: "company", id };
}
