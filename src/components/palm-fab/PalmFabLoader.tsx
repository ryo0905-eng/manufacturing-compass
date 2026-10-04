"use client";

import dynamic from "next/dynamic";

const PalmFabGame = dynamic(() => import("./PalmFabGame"), {
  ssr: false,
  loading: () => <p style={{ padding: "3rem", textAlign: "center" }}>工場を準備しています…</p>,
});

export function PalmFabLoader() { return <PalmFabGame />; }
