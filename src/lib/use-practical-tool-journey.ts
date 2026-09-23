"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";

type Source = "sample" | "custom";
type Step = "start" | "sample" | "calculate" | "error" | "result";

/** Only fixed categories leave the browser; input values and errors stay local. */
export function usePracticalToolJourney(toolId: "cpk" | "process-comparison" | "measurement-planner" | "improvement-report", locale: "ja" | "en", result: unknown, initialSource: Source) {
  const inputRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const seen = useRef(new Set<string>());
  const source = useRef<Source>(initialSource);

  function record(key: string, event: string, properties: Record<string, string>) {
    if (seen.current.has(key)) return;
    seen.current.add(key);
    try { trackEvent(event, { tool_id: toolId, locale, ui_version: "practical-v1", ...properties }); }
    catch { /* Measurement must not interrupt calculations or editing. */ }
  }
  function step(value: Step) {
    record(value, "tool_step", { step: value, data_source: source.current });
  }
  function start(nextSource: Source = "custom") {
    source.current = nextSource;
    step("start");
  }

  useEffect(() => {
    if (!inputRef.current) return;
    return observeVisibleOnce(inputRef.current, () => record("view", "experience_view", { surface: "tool" }));
    // Tool identity and locale are fixed for this mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // An initial, precomputed sample is not a user-generated result.
    if (!result || !seen.current.has("start") || seen.current.has("result") || !resultRef.current) return;
    const resultSource = source.current;
    return observeVisibleOnce(resultRef.current, () => record("result", "tool_step", { step: "result", data_source: resultSource }));
    // Each new result replaces the observer; clearing input cancels it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return {
    inputRef, resultRef, start,
    clear() { source.current = "custom"; },
    sample() { start("sample"); step("sample"); },
    calculate() { start(source.current); step("calculate"); },
    error() { step("error"); },
  };
}
