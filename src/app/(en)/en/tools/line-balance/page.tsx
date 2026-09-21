import { LineBalanceSimulator } from "@/components/LineBalanceSimulator";
import { EnglishPracticalToolPage } from "@/components/EnglishPracticalToolPage";
import { englishPracticalToolMetadata } from "@/lib/practical-tool-metadata";

export function generateMetadata() { return englishPracticalToolMetadata("line-balance"); }

export default function Page() {
  return <EnglishPracticalToolPage id="line-balance"><LineBalanceSimulator locale="en" /></EnglishPracticalToolPage>;
}
