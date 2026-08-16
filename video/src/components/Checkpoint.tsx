import type {ReactNode} from "react";
import {theme} from "../theme";

export const Checkpoint = ({number, label, title, children}: {number: string; label: string; title: string; children: ReactNode}) => (
  <div style={{backgroundColor: theme.surface, border: `2px solid ${theme.border}`, borderRadius: 18, padding: "34px 38px", display: "grid", gridTemplateColumns: "92px 1fr", gap: 24, alignItems: "start"}}>
    <div style={{width: 76, height: 76, borderRadius: 999, backgroundColor: theme.selected, color: theme.action, display: "grid", placeItems: "center", fontSize: 31, fontWeight: 800}}>{number}</div>
    <div>
      <div style={{fontSize: 21, color: theme.action, fontWeight: 750, letterSpacing: "0.1em", marginBottom: 10}}>{label}</div>
      <div style={{fontSize: 43, fontWeight: 750, letterSpacing: "-0.02em", marginBottom: 13}}>{title}</div>
      <div style={{fontSize: 27, lineHeight: 1.55, color: theme.muted}}>{children}</div>
    </div>
  </div>
);
