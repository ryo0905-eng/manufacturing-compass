"use client";

import Image from "next/image";
import { useState } from "react";
import type { PulseProcess, PulseSignal } from "@/data/chip-pulse";
import { resolvePulseThumbnail } from "@/lib/chip-pulse-thumbnail";
import styles from "./ChipPulseDashboard.module.css";

function ProcessArt({ process }: { process: PulseProcess | "General" }) {
  if (process === "Design") return <><rect x="112" y="42" width="96" height="96" rx="14" /><path d="M112 66H70M112 90H48M112 114H70M208 66H250M208 90H272M208 114H250M136 42V20M160 42V10M184 42V20M136 138V160M160 138V170M184 138V160" /></>;
  if (process === "Lithography") return <><path d="M132 18h56l-9 42h-38z" /><path d="M160 60v39M121 26l22 73M199 26l-22 73" /><ellipse cx="160" cy="126" rx="92" ry="28" /><path d="M104 126h112M126 111v30M160 101v50M194 111v30" /></>;
  if (process === "Deposition") return <><path d="M76 124h168M88 108h144M100 92h120M112 76h96" /><path d="M118 28l12 26M160 18v36M202 28l-12 26" /><circle cx="118" cy="26" r="8" /><circle cx="160" cy="16" r="8" /><circle cx="202" cy="26" r="8" /></>;
  if (process === "Etch") return <><path d="M66 120h188M74 100h44v34h30v-34h24v34h30v-34h44" /><path d="M102 28v48M160 18v58M218 28v48" /><path d="m92 64 10 12 10-12m38 0 10 12 10-12m38 0 10 12 10-12" /></>;
  if (process === "Metrology") return <><circle cx="154" cy="88" r="54" /><path d="m194 126 50 40M66 88h176M154 20v136" /><rect x="117" y="52" width="74" height="72" rx="7" /><path d="M130 66h48M130 80h30M130 96h42" /></>;
  if (process === "Assembly") return <><rect x="96" y="72" width="128" height="70" rx="10" /><rect x="128" y="90" width="64" height="34" rx="5" /><path d="M128 96C98 58 76 54 56 54M192 96c30-38 52-42 72-42M118 142v22M142 142v22M166 142v22M190 142v22" /><circle cx="56" cy="54" r="7" /><circle cx="264" cy="54" r="7" /></>;
  if (process === "Test") return <><rect x="88" y="54" width="144" height="92" rx="14" /><path d="M112 80h30l14 30 17-48 15 34h22M112 124h96M70 36l30 30M250 36l-30 30" /><circle cx="70" cy="36" r="8" /><circle cx="250" cy="36" r="8" /></>;
  if (process === "Materials") return <><circle cx="104" cy="92" r="34" /><circle cx="160" cy="56" r="28" /><circle cx="214" cy="96" r="38" /><circle cx="154" cy="132" r="24" /><path d="M130 75l12-8M184 72l8 7M128 111l10 9M182 125l8-8" /></>;
  return <><path d="M94 52h132v96H94z" /><path d="M116 74h88v52h-88zM94 76H62M94 100H48M94 124H62M226 76h32M226 100h46M226 124h32" /><circle cx="160" cy="100" r="14" /></>;
}

export function NewsThumbnail({ signal }: { signal: Pick<PulseSignal, "processes" | "thumbnail"> }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const presentation = resolvePulseThumbnail(signal, failedSrc === signal.thumbnail?.src);

  if (presentation.kind === "image") {
    return (
      <figure className={`${styles.newsThumbnail} ${styles.newsThumbnailImage}`}>
        <Image
          src={presentation.src}
          alt={presentation.alt}
          width={640}
          height={360}
          sizes="(max-width: 640px) calc(100vw - 40px), 180px"
          onError={() => setFailedSrc(presentation.src)}
        />
        <figcaption>{presentation.credit}</figcaption>
      </figure>
    );
  }

  const processClass = styles[`newsThumbnail_${presentation.process.toLowerCase()}`] ?? styles.newsThumbnail_general;
  return (
    <figure className={`${styles.newsThumbnail} ${styles.newsThumbnailProcess} ${processClass}`} aria-hidden="true">
      <svg viewBox="0 0 320 180" focusable="false"><ProcessArt process={presentation.process} /></svg>
      <figcaption><span>PROCESS VIEW</span><strong>{presentation.label}</strong></figcaption>
    </figure>
  );
}
