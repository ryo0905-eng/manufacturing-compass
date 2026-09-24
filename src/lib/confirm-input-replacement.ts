type TextFields = Record<string, string>;

/** Only protect nonempty, non-default values that this action would replace. */
export function wouldReplaceInput(current: TextFields, next: TextFields, empty: TextFields, edited: boolean): boolean {
  return edited && Object.keys(current).some(key => current[key].trim() !== "" && current[key] !== empty[key] && current[key] !== next[key]);
}

export function confirmInputReplacement(locale: "ja" | "en", includesNotes = false): boolean {
  const message = locale === "en"
    ? includesNotes ? "Replace the current measurement inputs and report text? Cancel and save your inputs first if you need to keep them." : "Replace the current measurement inputs? Cancel and save your inputs first if you need to keep them."
    : includesNotes ? "現在の測定入力と報告文を置き換えますか？ 残しておきたい場合はキャンセルして、先に入力を保存してください。" : "現在の測定入力を置き換えますか？ 残しておきたい場合はキャンセルして、先に入力を保存してください。";
  return window.confirm(message);
}
