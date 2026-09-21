import { ProcessComparisonTool } from "@/components/ProcessComparisonTool";
import { EnglishPracticalToolPage } from "@/components/EnglishPracticalToolPage";
import { englishPracticalToolMetadata } from "@/lib/practical-tool-metadata";
import styles from "@/app/(ja)/tools/process-comparison/comparison.module.css";

export function generateMetadata() { return englishPracticalToolMetadata("process-comparison"); }

export default function Page() {
  return <EnglishPracticalToolPage id="process-comparison" className={styles.page}><ProcessComparisonTool locale="en" /></EnglishPracticalToolPage>;
}
