import {
  GAME_STAT_LIMITS,
  RESULT_TITLES,
  type ChoiceRequirement,
  type GameFlag,
  type GameStats,
  type SurvivalChoice,
  type SurvivalEvent,
} from "@/data/process-engineer-survival";

export function clampStats(stats: GameStats, effects: Partial<GameStats>): GameStats {
  return (Object.keys(stats) as Array<keyof GameStats>).reduce((next, key) => {
    const [minimum, maximum] = GAME_STAT_LIMITS[key];
    next[key] = Math.min(maximum, Math.max(minimum, stats[key] + (effects[key] ?? 0)));
    return next;
  }, { ...stats });
}

export function meetsRequirement(
  requirement: ChoiceRequirement | undefined,
  stats: GameStats,
  flags: ReadonlySet<GameFlag>,
) {
  if (!requirement) return true;
  if (requirement.flag && !flags.has(requirement.flag)) return false;
  return Object.entries(requirement.minStat ?? {}).every(([key, minimum]) => (
    stats[key as keyof GameStats] >= (minimum ?? 0)
  ));
}

export function eventDescription(event: SurvivalEvent, stats: GameStats, flags: ReadonlySet<GameFlag>) {
  return event.variants?.find((variant) => meetsRequirement(variant.requires, stats, flags))?.description
    ?? event.description;
}

export function availableChoices(event: SurvivalEvent, stats: GameStats, flags: ReadonlySet<GameFlag>) {
  return event.choices.map((choice) => ({
    ...choice,
    available: meetsRequirement(choice.requires, stats, flags),
  }));
}

export function formatGameTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function applyChoiceFlags(flags: ReadonlySet<GameFlag>, choice: SurvivalChoice) {
  return new Set([...flags, ...(choice.addFlags ?? [])]);
}

type ResultTitleInput = {
  stats: GameStats;
  flags: ReadonlySet<GameFlag>;
};

export function getResultTitle({ stats, flags }: ResultTitleInput) {
  return RESULT_TITLES.find(({ requires }) => {
    if ("minTrust" in requires && stats.trust < (requires.minTrust ?? 0)) return false;
    if ("minBoss" in requires && stats.boss < (requires.minBoss ?? 0)) return false;
    if ("minHp" in requires && stats.hp < (requires.minHp ?? 0)) return false;
    if ("minYield" in requires && stats.yield < (requires.minYield ?? 0)) return false;
    if ("minInvestigation" in requires && stats.investigation < (requires.minInvestigation ?? 0)) return false;
    if ("maxSan" in requires && stats.san > (requires.maxSan ?? 100)) return false;
    if ("rootCause" in requires && requires.rootCause && !flags.has("root_cause_found")) return false;
    if ("flag" in requires && requires.flag && !flags.has(requires.flag)) return false;
    return true;
  }) ?? RESULT_TITLES[RESULT_TITLES.length - 1];
}
