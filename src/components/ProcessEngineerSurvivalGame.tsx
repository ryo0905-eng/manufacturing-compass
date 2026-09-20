"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GAME_END_MINUTES,
  GAME_LOCATIONS,
  GAME_START_MINUTES,
  INITIAL_GAME_STATS,
  LEARNING_ITEMS,
  SURVIVAL_EVENTS,
  type GameFlag,
  type GameLocationId,
  type GameStats,
  type SurvivalChoice,
} from "@/data/process-engineer-survival";
import {
  applyChoiceFlags,
  availableChoices,
  clampStats,
  eventDescription,
  formatGameTime,
  getResultTitle,
} from "@/lib/process-engineer-survival";
import { trackGameEvent } from "@/lib/analytics";
import {
  ProcessEngineerSurvivalCanvas,
  type SurvivalCanvasHandle,
} from "@/components/ProcessEngineerSurvivalCanvas";

type GamePhase = "intro" | "playing" | "event" | "feedback" | "finished";
type EndingReason = "clocked_out" | "hp_depleted" | "san_depleted";

const HUD_STATS: Array<{ key: keyof Pick<GameStats, "hp" | "san" | "yield" | "trust" | "boss">; label: string; suffix?: string }> = [
  { key: "hp", label: "HP" },
  { key: "san", label: "SAN" },
  { key: "yield", label: "Yield", suffix: "%" },
  { key: "trust", label: "Trust" },
  { key: "boss", label: "Boss" },
];

const USED_LEARNING_FLAGS: Record<(typeof LEARNING_ITEMS)[number]["id"], GameFlag[]> = {
  "four-m": ["root_cause_found"],
  spc: ["checked_spc"],
  floor: ["heard_floor", "heard_noise"],
  stratify: ["stratified_data"],
  countermeasure: ["reset_conditions", "root_cause_found"],
};

export function ProcessEngineerSurvivalGame() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [stats, setStats] = useState<GameStats>({ ...INITIAL_GAME_STATS });
  const [flags, setFlags] = useState<Set<GameFlag>>(new Set());
  const [eventIndex, setEventIndex] = useState(0);
  const [currentMinutes, setCurrentMinutes] = useState(GAME_START_MINUTES);
  const [nearbyId, setNearbyId] = useState<GameLocationId | null>(null);
  const [floorMessage, setFloorMessage] = useState("黄色い「!」の場所へ向かおう");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastEffects, setLastEffects] = useState<Partial<GameStats>>({});
  const [resolvedTroubles, setResolvedTroubles] = useState(0);
  const [endingReason, setEndingReason] = useState<EndingReason>("clocked_out");
  const [shareMessage, setShareMessage] = useState("");
  const canvasHandleRef = useRef<SurvivalCanvasHandle | null>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);

  const currentEvent = SURVIVAL_EVENTS[eventIndex] ?? null;
  const activeLocationId = phase === "playing" ? currentEvent?.locationId ?? null : null;
  const currentLocation = GAME_LOCATIONS.find((location) => location.id === currentEvent?.locationId);
  const resultTitle = useMemo(() => getResultTitle({ stats, flags }), [stats, flags]);

  useEffect(() => {
    if (phase === "event") firstChoiceRef.current?.focus();
  }, [phase]);

  const handleCanvasReady = useCallback((handle: SurvivalCanvasHandle | null) => {
    canvasHandleRef.current = handle;
  }, []);

  const resetGame = useCallback((isRetry: boolean) => {
    setStats({ ...INITIAL_GAME_STATS });
    setFlags(new Set());
    setEventIndex(0);
    setCurrentMinutes(GAME_START_MINUTES);
    setNearbyId(null);
    setFeedback(null);
    setLastEffects({});
    setResolvedTroubles(0);
    setEndingReason("clocked_out");
    setFloorMessage("黄色い「!」の場所へ向かおう");
    setShareMessage("");
    setPhase("playing");
    if (isRetry) trackGameEvent("game_retry", { stage_id: "monday-morning" });
    trackGameEvent("game_start", { stage_id: "monday-morning" });
  }, []);

  const handleInteract = useCallback((locationId: GameLocationId) => {
    if (phase !== "playing" || !currentEvent) return;
    if (locationId !== currentEvent.locationId) {
      const location = GAME_LOCATIONS.find((item) => item.id === locationId);
      setFloorMessage(`${location?.shortLabel ?? "ここ"}は今の呼び出し先ではない。黄色い「!」を追おう。`);
      return;
    }
    setCurrentMinutes((minutes) => Math.max(minutes, currentEvent.time));
    setFloorMessage("");
    setPhase("event");
  }, [currentEvent, phase]);

  const finishGame = useCallback((nextStats: GameStats, nextFlags: Set<GameFlag>, reason: EndingReason, completedCount: number, minutes: number) => {
    setStats(nextStats);
    setFlags(nextFlags);
    setEndingReason(reason);
    setCurrentMinutes(minutes);
    setPhase("finished");
    const title = getResultTitle({ stats: nextStats, flags: nextFlags });
    trackGameEvent("game_complete", {
      stage_id: "monday-morning",
      ending: reason,
      title_id: title.id,
      resolved_band: completedCount >= 8 ? "8_plus" : completedCount >= 5 ? "5_to_7" : "0_to_4",
    });
  }, []);

  const choose = useCallback((choice: SurvivalChoice) => {
    if (!currentEvent || phase !== "event") return;
    const choiceState = availableChoices(currentEvent, stats, flags).find((item) => item.id === choice.id);
    if (!choiceState?.available) return;

    const nextStats = clampStats(stats, choice.effects);
    const nextFlags = applyChoiceFlags(flags, choice);
    const nextResolved = resolvedTroubles + (choice.resolvesTrouble ? 1 : 0);
    const nextMinutes = Math.max(currentMinutes, currentEvent.time) + currentEvent.duration;
    setStats(nextStats);
    setFlags(nextFlags);
    setResolvedTroubles(nextResolved);
    setCurrentMinutes(nextMinutes);
    setFeedback(choice.result);
    setLastEffects(choice.effects);
    setPhase("feedback");
    trackGameEvent("game_event_choice", {
      stage_id: "monday-morning",
      event_id: currentEvent.id,
      choice_id: choice.id,
    });

    if (nextStats.hp <= 0 || nextStats.san <= 0) {
      window.setTimeout(() => {
        finishGame(nextStats, nextFlags, nextStats.hp <= 0 ? "hp_depleted" : "san_depleted", nextResolved, nextMinutes);
      }, 900);
    }
  }, [currentEvent, currentMinutes, finishGame, flags, phase, resolvedTroubles, stats]);

  const continueAfterFeedback = useCallback(() => {
    if (!currentEvent || stats.hp <= 0 || stats.san <= 0) return;
    const nextIndex = eventIndex + 1;
    if (nextIndex >= SURVIVAL_EVENTS.length) {
      finishGame(stats, flags, "clocked_out", resolvedTroubles, Math.max(currentMinutes, GAME_END_MINUTES));
      return;
    }
    setEventIndex(nextIndex);
    setFeedback(null);
    setLastEffects({});
    setNearbyId(null);
    setFloorMessage(`次は ${formatGameTime(SURVIVAL_EVENTS[nextIndex].time)}。黄色い「!」へ向かおう`);
    setPhase("playing");
  }, [currentEvent, currentMinutes, eventIndex, finishGame, flags, resolvedTroubles, stats]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLButtonElement) return;
      if (phase === "feedback" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        continueAfterFeedback();
        return;
      }
      if (phase === "event" && currentEvent && ["1", "2", "3"].includes(event.key)) {
        const choice = availableChoices(currentEvent, stats, flags)[Number(event.key) - 1];
        if (choice?.available) choose(choice);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [choose, continueAfterFeedback, currentEvent, flags, phase, stats]);

  const shareResult = useCallback(async () => {
    const text = `製造技術者サバイバル「月曜日の朝」\n称号：${resultTitle.label}\n歩留まり ${stats.yield}% / Trust ${stats.trust} / 解決 ${resolvedTroubles}件\n#製造技術者サバイバル #ManufacturingCompass`;
    try {
      const shareMethod = Reflect.get(navigator, "share") as Navigator["share"] | undefined;
      const shared = typeof shareMethod === "function";
      if (shared) await shareMethod.call(navigator, { title: "製造技術者サバイバル", text, url: window.location.href });
      else await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setShareMessage(shared ? "共有メニューを開きました" : "結果をコピーしました");
    } catch {
      setShareMessage("共有をキャンセルしました");
    }
  }, [resolvedTroubles, resultTitle.label, stats.trust, stats.yield]);

  const pressDirection = (direction: "down" | "left" | "right" | "up", pressed: boolean) => {
    canvasHandleRef.current?.setDirection(direction, pressed);
  };

  const nearbyLocation = GAME_LOCATIONS.find((location) => location.id === nearbyId);
  const overtime = Math.max(0, currentMinutes - GAME_END_MINUTES);
  const endingLabel = endingReason === "clocked_out" ? "17時を越えて引継ぎ完了" : endingReason === "hp_depleted" ? "体力が尽きて保健室へ" : "精神力が尽きてPCをそっと閉じた";

  return (
    <section className="survival-game" aria-label="製造技術者サバイバル ゲーム">
      <div className="survival-hud" aria-label="現在のステータス">
        {HUD_STATS.map(({ key, label, suffix }) => (
          <div className="survival-meter" key={key}>
            <div><span>{label}</span><strong>{stats[key]}{suffix}</strong></div>
            <span className="survival-meter__track" aria-hidden="true"><i style={{ width: `${stats[key]}%` }} /></span>
          </div>
        ))}
        <div className="survival-clock"><span>TIME</span><strong>{formatGameTime(currentMinutes)}</strong><small>MON</small></div>
      </div>

      <div className="survival-stage">
        <ProcessEngineerSurvivalCanvas
          activeLocationId={activeLocationId}
          paused={phase !== "playing"}
          onInteract={handleInteract}
          onNearbyChange={setNearbyId}
          onReady={handleCanvasReady}
        />
        {phase !== "intro" ? <div className="survival-stage-progress" aria-hidden="true"><span>MONDAY SHIFT</span><strong>{Math.min(eventIndex + 1, SURVIVAL_EVENTS.length).toString().padStart(2, "0")} / {SURVIVAL_EVENTS.length}</strong></div> : null}

        {phase === "intro" ? (
          <div className="survival-overlay survival-intro">
            <p className="survival-kicker">STAGE 01</p>
            <h2>月曜日の朝</h2>
            <p>朝8時。メール17件、未読Teams 6件、歩留まりはまだ平和。黄色い「!」へ移動し、17時まで工場の一日を乗り切ろう。</p>
            <ul><li>移動：矢印キー / WASD / 画面の方向キー</li><li>調べる：Enter / Space / ACTION</li><li>選択によって後半の情報と選択肢が変化</li></ul>
            <button type="button" onClick={() => resetGame(false)}>8:00 出社する</button>
          </div>
        ) : null}

        {phase === "event" && currentEvent ? (
          <div className="survival-overlay survival-dialog" role="dialog" aria-modal="true" aria-labelledby="survival-event-title">
            <header><span>{formatGameTime(currentEvent.time)}</span><span>{currentLocation?.label}</span></header>
            {currentEvent.speaker ? <p className="survival-speaker">{currentEvent.speaker}</p> : null}
            <h2 id="survival-event-title">{currentEvent.title}</h2>
            <p>{eventDescription(currentEvent, stats, flags)}</p>
            <div className="survival-choices">
              {availableChoices(currentEvent, stats, flags).map((choice, index) => (
                <button
                  ref={index === 0 ? firstChoiceRef : undefined}
                  type="button"
                  key={choice.id}
                  disabled={!choice.available}
                  onClick={() => choose(choice)}
                >
                  <span><b>{index + 1}</b>{choice.text}</span>
                  {!choice.available ? <small>{choice.unavailableText}</small> : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {phase === "feedback" && feedback ? (
          <div className="survival-overlay survival-feedback" role="status">
            <p className="survival-kicker">ACTION RESULT</p>
            <p>{feedback}</p>
            <div className="survival-effect-chips" aria-label="ステータス変化">
              {Object.entries(lastEffects).filter(([, value]) => value !== 0).map(([key, value]) => <span key={key} data-positive={(value ?? 0) > 0}>{key.toUpperCase()} {(value ?? 0) > 0 ? "+" : ""}{value}</span>)}
            </div>
            <button type="button" onClick={continueAfterFeedback}>NEXT →<small>Enter / Space</small></button>
          </div>
        ) : null}

        {phase === "finished" ? (
          <div className="survival-overlay survival-result">
            <p className="survival-kicker">SHIFT COMPLETE</p>
            <h2>{resultTitle.label}</h2>
            <p>{resultTitle.description}</p>
            <dl>
              <div><dt>Final Yield</dt><dd>{stats.yield}%</dd></div>
              <div><dt>残業時間</dt><dd>{overtime}分</dd></div>
              <div><dt>Trust / Boss</dt><dd>{stats.trust} / {stats.boss}</dd></div>
              <div><dt>HP / SAN</dt><dd>{stats.hp} / {stats.san}</dd></div>
              <div><dt>解決できたトラブル</dt><dd>{resolvedTroubles} / {SURVIVAL_EVENTS.length}</dd></div>
            </dl>
            <small>{endingLabel}</small>
            <div className="survival-result__actions">
              <button type="button" onClick={() => resetGame(true)}>もう一度月曜日を始める</button>
              <button type="button" className="is-secondary" onClick={shareResult}>結果を共有</button>
            </div>
            {shareMessage ? <p className="survival-share-message" role="status">{shareMessage}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="survival-controls" aria-label="ゲーム操作">
        <div className="survival-dpad">
          {(["up", "left", "down", "right"] as const).map((direction) => (
            <button
              type="button"
              className={`is-${direction}`}
              key={direction}
              aria-label={`${direction}へ移動`}
              onPointerDown={() => pressDirection(direction, true)}
              onPointerUp={() => pressDirection(direction, false)}
              onPointerCancel={() => pressDirection(direction, false)}
              onPointerLeave={() => pressDirection(direction, false)}
            >{direction === "up" ? "▲" : direction === "down" ? "▼" : direction === "left" ? "◀" : "▶"}</button>
          ))}
        </div>
        <div className="survival-prompt" aria-live="polite">
          <strong>{nearbyLocation ? `${nearbyLocation.shortLabel} の近く` : floorMessage}</strong>
          <span>{currentEvent ? `目的地：${currentLocation?.label}　Shiftでダッシュ` : ""}</span>
        </div>
        <button
          type="button"
          className="survival-action"
          onClick={() => canvasHandleRef.current?.interact()}
          disabled={phase !== "playing" || !nearbyId}
        >ACTION<small>Enter / Space</small></button>
      </div>

      {phase === "finished" ? (
        <section className="survival-learning" aria-labelledby="survival-learning-title">
          <header><p className="section-label">PLAY → LEARN → TRY</p><h2 id="survival-learning-title">今回使われた問題解決の考え方</h2><p>ゲーム内の判断は簡略化した学習用表現です。実工程では安全・品質の手順と、十分なデータ確認を優先してください。</p></header>
          <div>
            {LEARNING_ITEMS.map((item) => {
              const used = USED_LEARNING_FLAGS[item.id].some((flag) => flags.has(flag));
              return <article key={item.id} data-used={used}><span>{used ? "今回使った" : "次に試す"}</span><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href} onClick={() => trackGameEvent("related_tool_click", { stage_id: "monday-morning", destination_id: item.id })}>関連ツールで学ぶ →</Link></article>;
            })}
          </div>
        </section>
      ) : null}
    </section>
  );
}
