import { OeeSimulator } from "@/components/OeeSimulator";
import { EnglishPracticalToolPage } from "@/components/EnglishPracticalToolPage";
import { englishPracticalToolMetadata } from "@/lib/practical-tool-metadata";

export function generateMetadata() { return englishPracticalToolMetadata("oee"); }

export default function Page() {
  return <EnglishPracticalToolPage id="oee"><OeeSimulator locale="en" /></EnglishPracticalToolPage>;
}
