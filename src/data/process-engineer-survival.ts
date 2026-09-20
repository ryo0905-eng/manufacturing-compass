export type GameStatKey = "hp" | "san" | "yield" | "trust" | "boss" | "investigation";

export type GameStats = Record<GameStatKey, number>;

export type GameFlag =
  | "heard_floor"
  | "checked_spc"
  | "contained_lot"
  | "heard_noise"
  | "stratified_data"
  | "protected_break"
  | "aligned_overseas"
  | "explained_with_evidence"
  | "saved_excel"
  | "root_cause_found"
  | "prayed_to_excel"
  | "reset_conditions";

export type GameLocationId =
  | "machine-a"
  | "machine-b"
  | "machine-c"
  | "quality"
  | "boss"
  | "meeting"
  | "break-room"
  | "analysis-pc";

export type ChoiceRequirement = {
  flag?: GameFlag;
  minStat?: Partial<Pick<GameStats, "trust" | "investigation">>;
};

export type SurvivalChoice = {
  id: string;
  text: string;
  result: string;
  effects: Partial<GameStats>;
  addFlags?: GameFlag[];
  resolvesTrouble?: boolean;
  requires?: ChoiceRequirement;
  unavailableText?: string;
};

export type EventVariant = {
  description: string;
  requires: ChoiceRequirement;
};

export type SurvivalEvent = {
  id: string;
  time: number;
  duration: number;
  locationId: GameLocationId;
  speaker?: string;
  title: string;
  description: string;
  variants?: EventVariant[];
  choices: SurvivalChoice[];
};

export type GameLocation = {
  id: GameLocationId;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
  kind: "machine" | "person" | "room" | "pc";
};

export const INITIAL_GAME_STATS: GameStats = {
  hp: 100,
  san: 100,
  yield: 92,
  trust: 50,
  boss: 50,
  investigation: 0,
};

export const GAME_START_MINUTES = 8 * 60;
export const GAME_END_MINUTES = 17 * 60;
export const GAME_STAT_LIMITS: Record<GameStatKey, [number, number]> = {
  hp: [0, 100],
  san: [0, 100],
  yield: [70, 100],
  trust: [0, 100],
  boss: [0, 100],
  investigation: [0, 100],
};

export const GAME_LOCATIONS: GameLocation[] = [
  { id: "machine-a", label: "生産設備A", shortLabel: "設備A", x: 145, y: 126, width: 122, height: 58, kind: "machine" },
  { id: "machine-b", label: "生産設備B", shortLabel: "設備B", x: 332, y: 126, width: 122, height: 58, kind: "machine" },
  { id: "machine-c", label: "生産設備C", shortLabel: "設備C", x: 519, y: 126, width: 122, height: 58, kind: "machine" },
  { id: "quality", label: "品質担当エリア", shortLabel: "品質", x: 686, y: 118, width: 116, height: 76, kind: "person" },
  { id: "boss", label: "上司席", shortLabel: "上司席", x: 112, y: 334, width: 92, height: 64, kind: "person" },
  { id: "meeting", label: "会議室", shortLabel: "会議室", x: 284, y: 344, width: 126, height: 86, kind: "room" },
  { id: "break-room", label: "休憩室", shortLabel: "休憩室", x: 468, y: 344, width: 112, height: 86, kind: "room" },
  { id: "analysis-pc", label: "PC・データ解析席", shortLabel: "解析PC", x: 656, y: 344, width: 118, height: 72, kind: "pc" },
];

export const SURVIVAL_EVENTS: SurvivalEvent[] = [
  {
    id: "yield-drop-01",
    time: 8 * 60 + 5,
    duration: 25,
    locationId: "machine-a",
    title: "歩留まり急落！",
    description: "Line 3の歩留まりが98%から87%へ急落した。朝礼はまだ終わっていない。",
    choices: [
      { id: "ask-floor", text: "現場に話を聞く", result: "作業者は『夜勤の途中から少し違和感があった』と教えてくれた。記録にない情報は、だいたい現場にある。", effects: { hp: -5, trust: 10, investigation: 20 }, addFlags: ["heard_floor"], resolvesTrouble: true },
      { id: "check-spc", text: "SPCを見る", result: "異常は深夜2時台から始まっていた。会議資料に貼れるグラフも手に入れた。", effects: { hp: -3, boss: 3, investigation: 18 }, addFlags: ["checked_spc"], resolvesTrouble: true },
      { id: "reset", text: "とりあえず条件を戻す", result: "数字は少し戻った。何を戻したのかは、あとで聞かれる予定だ。", effects: { yield: 4, trust: -6, investigation: -4 }, addFlags: ["reset_conditions"] },
    ],
  },
  {
    id: "quality-hold-01",
    time: 9 * 60 + 10,
    duration: 25,
    locationId: "quality",
    speaker: "品質担当",
    title: "このロット、出荷止めますね",
    description: "品質担当の声は穏やかだが、赤い保留票だけがやけに鮮やかだ。",
    choices: [
      { id: "contain", text: "対象範囲を一緒に切り分ける", result: "時刻と装置で対象を限定できた。全部止めるより、止める理由を説明できる方が強い。", effects: { hp: -6, trust: 8, boss: 4, investigation: 14 }, addFlags: ["contained_lot"], resolvesTrouble: true },
      { id: "argue", text: "まず出荷を優先して交渉する", result: "会話は長引き、保留票は増えた。品質担当のメモにも何かが増えた。", effects: { san: -12, trust: -8, boss: -4 } },
      { id: "accept-all", text: "全部止めてから考える", result: "安全側には倒した。生産計画も一緒に倒れた。", effects: { san: -5, yield: -3, boss: -8 }, addFlags: ["contained_lot"] },
    ],
  },
  {
    id: "machine-noise-01",
    time: 9 * 60 + 45,
    duration: 20,
    locationId: "machine-b",
    speaker: "作業者",
    title: "設備B、昨日から変な音してましたよ",
    description: "通りかかった作業者が、設備Bを指さした。いつもより会話の距離が近い。",
    variants: [
      { requires: { flag: "heard_floor", minStat: { trust: 55 } }, description: "朝に現場へ来ていたあなたを見つけ、作業者が声をかけてくれた。『設備Bだけ、昨日から変な音してましたよ』" },
    ],
    choices: [
      { id: "listen", text: "音と保全履歴を確認する", result: "異音の時刻と歩留まり低下が重なった。耳はセンサー、記録は証拠だ。", effects: { hp: -5, trust: 8, investigation: 18 }, addFlags: ["heard_noise"], resolvesTrouble: true },
      { id: "later", text: "会議後に見るとメモする", result: "未来の自分に仕事を委託した。未来の自分は承認していない。", effects: { san: -5, trust: -6 } },
      { id: "spec", text: "仕様内ならヨシとする", result: "音の仕様書は見つからなかったが、指差し確認だけは立派だった。", effects: { trust: -10, boss: 2 } },
    ],
  },
  {
    id: "boss-deadline-01",
    time: 10 * 60 + 30,
    duration: 20,
    locationId: "boss",
    speaker: "上司",
    title: "14時の会議までに原因まとめて",
    description: "『原因を一枚で』という追加条件が、席を離れかけた瞬間に届いた。",
    choices: [
      { id: "scope", text: "事実・仮説・未確認を分ける", result: "原因を断定せず、14時までに確認できる範囲を合意した。上司の眉間が2pxほど緩んだ。", effects: { san: -4, boss: 10, investigation: 8 }, resolvesTrouble: true },
      { id: "promise", text: "『完全に特定します』と言う", result: "言葉だけが先に量産へ入った。納期は14時、検証は未着手。", effects: { san: -12, boss: 5 } },
      { id: "slides", text: "まずPowerPointを開く", result: "タイトルと日付は完璧になった。原因はまだ白紙に近い。", effects: { hp: -3, boss: 2, investigation: -3 } },
    ],
  },
  {
    id: "data-dive-01",
    time: 11 * 60 + 10,
    duration: 35,
    locationId: "analysis-pc",
    title: "データは多い。情報は少ない。",
    description: "48列のCSVが開いた。列名の半分は略語、残り半分は誰かの優しさ待ちだ。",
    variants: [
      { requires: { flag: "checked_spc" }, description: "SPCで絞った異常発生時点を起点に、48列のCSVを開いた。設備別に見ると偏りがありそうだ。" },
    ],
    choices: [
      { id: "stratify", text: "装置別・ロット別に層別する", result: "設備Bの特定時間帯へ異常が集中していた。平均値の平和は、層別によって終わった。", effects: { hp: -8, investigation: 22, yield: 3 }, addFlags: ["stratified_data"], resolvesTrouble: true },
      { id: "average", text: "全体平均だけを会議資料にする", result: "グラフは滑らかで美しい。問題も滑らかに見えなくなった。", effects: { boss: 3, investigation: -8 } },
      { id: "pivot", text: "ピボットテーブルを増殖させる", result: "シートは増えた。理解はセル結合された。", effects: { hp: -5, san: -5, investigation: 6 } },
    ],
  },
  {
    id: "lunch-01",
    time: 12 * 60 + 10,
    duration: 35,
    locationId: "break-room",
    title: "昼休みという名のバッファ",
    description: "休憩室に着いた。電子レンジの前だけ、工程能力が不足している。",
    choices: [
      { id: "eat", text: "15分でも食べて休む", result: "HPとSANが回復した。休憩はロスではなく、午後の再現性を守る標準作業だ。", effects: { hp: 15, san: 12 }, addFlags: ["protected_break"], resolvesTrouble: true },
      { id: "desk", text: "席で資料を作りながら食べる", result: "資料にソースの染みと考察が一行増えた。", effects: { hp: -5, boss: 5, investigation: 5 } },
      { id: "skip", text: "昼休みをなかったことにする", result: "時間は生まれなかったが、空腹だけは再現性よく発生した。", effects: { hp: -15, san: -8, boss: 3 } },
    ],
  },
  {
    id: "overseas-call-01",
    time: 13 * 60,
    duration: 30,
    locationId: "meeting",
    speaker: "海外工場",
    title: "Teams着信：Can you quickly check?",
    description: "quickly の定義を確認する前に、画面共有が始まった。",
    choices: [
      { id: "facts", text: "現象・変更点・次の確認を揃える", result: "同じ現象名でも条件が違うと判明した。宿題を分け、会議を予定時刻内で閉じた。", effects: { hp: -5, trust: 5, investigation: 10 }, addFlags: ["aligned_overseas"], resolvesTrouble: true },
      { id: "fix-live", text: "画面共有のまま直し始める", result: "参加者が増え、マウスポインターだけが国境を越えた。", effects: { hp: -10, san: -10 } },
      { id: "say-yes", text: "聞き取れた単語だけでYesと言う", result: "次回会議のオーナーになった。英語より先に議事録が必要だった。", effects: { san: -9, boss: -4 } },
    ],
  },
  {
    id: "review-meeting-01",
    time: 14 * 60,
    duration: 35,
    locationId: "boss",
    title: "14時 原因報告会",
    description: "関係者がそろった。『で、原因は？』が最初の議題になりそうだ。",
    choices: [
      { id: "evidence", text: "時系列と層別結果から説明する", result: "事実、原因候補、確認計画を分けて説明した。結論を急がない説明が、むしろ一番早かった。", effects: { boss: 15, trust: 7, investigation: 10 }, addFlags: ["explained_with_evidence"], resolvesTrouble: true, requires: { minStat: { investigation: 45 } }, unavailableText: "調査度45以上で選択可能" },
      { id: "single-cause", text: "設備Bが原因と断定する", result: "会議は短く終わった。反証データが廊下で待っている気がする。", effects: { boss: 5, trust: -7, san: -5 } },
      { id: "more-data", text: "追加データが必要と正直に伝える", result: "宿題は残ったが、誤った対策の量産は止めた。", effects: { boss: -3, trust: 5, investigation: 5 }, resolvesTrouble: true },
    ],
  },
  {
    id: "excel-freeze-01",
    time: 15 * 60,
    duration: 25,
    locationId: "analysis-pc",
    title: "Excelが応答していません",
    description: "保存したのは、たしか……いつだっただろう。白い画面がすべてを問いかけてくる。",
    choices: [
      { id: "wait", text: "待つ", result: "Excelは戻った。人類はまた一つ、待つことの価値を学んだ。すぐ保存した。", effects: { san: -5, boss: 4 }, addFlags: ["saved_excel"], resolvesTrouble: true },
      { id: "force", text: "強制終了", result: "プロセスは終わった。午後の一部も終わった。", effects: { hp: -8, san: -15, boss: -6 } },
      { id: "pray", text: "祈る", result: "祈りの進捗バーは表示されない。だが3分後、Excelは戻った。", effects: { san: 3, boss: -2 }, addFlags: ["prayed_to_excel"], resolvesTrouble: true },
    ],
  },
  {
    id: "final-defect-01",
    time: 16 * 60 + 45,
    duration: 25,
    locationId: "machine-c",
    title: "16:45 新しい不具合発生",
    description: "定時まで15分。設備Cから、見たことのない不良が一枚だけ出た。工場の月曜日は最後まで月曜日だ。",
    choices: [
      { id: "use-evidence", text: "変化点を確認して安全に引き継ぐ", result: "朝から集めた事実を使い、影響範囲と次の確認を明確にした。明日の自分へ、読める引継ぎを残した。", effects: { hp: -5, yield: 5, trust: 10, boss: 8 }, addFlags: ["root_cause_found"], resolvesTrouble: true, requires: { minStat: { investigation: 60 } }, unavailableText: "調査度60以上で選択可能" },
      { id: "stop-and-check", text: "対象を止めて4Mの変化点を確認", result: "定時は少し越えたが、材料ロットの切替を発見した。止める範囲と再開条件を残せた。", effects: { hp: -8, san: -5, yield: 3, trust: 8, investigation: 12 }, addFlags: ["root_cause_found"], resolvesTrouble: true },
      { id: "tomorrow", text: "明日の朝イチ案件にする", result: "PCを閉じた瞬間、Teamsの通知が一つ増えた。見なかったことには、まだできる。", effects: { yield: -6, trust: -8, boss: -10 } },
    ],
  },
];

export const RESULT_TITLES = [
  { id: "on-time-legend", label: "定時退社の伝説", description: "問題を人ではなく事実で追い、引継ぎまで終えた。工場では目撃例の少ない存在。", requires: { minTrust: 65, minBoss: 60, minHp: 30, rootCause: true } },
  { id: "yield-savior", label: "歩留まりの救世主", description: "グラフと現場の両方を見た。数字が戻った理由まで説明できるタイプ。", requires: { minYield: 96, minInvestigation: 65 } },
  { id: "floor-beloved", label: "現場に愛された技術者", description: "会議室より先に現場へ行った。その行動は、意外とみんな見ている。", requires: { minTrust: 72 } },
  { id: "meeting-perfect", label: "会議だけは完璧な技術者", description: "資料、結論、次回会議。すべて整った。設備の音だけがまだ気になる。", requires: { minBoss: 75 } },
  { id: "excel-fallen", label: "Excelと共に散った者", description: "保存は操作ではない。思想である。次回はCtrl+Sを標準作業にしよう。", requires: { maxSan: 25 } },
  { id: "condition-resetter", label: "とりあえず条件を戻す人", description: "数字は戻った。原因は戻ってこなかった。次は変更点を一つずつ残そう。", requires: { flag: "reset_conditions" as GameFlag } },
  { id: "monday-survivor", label: "月曜日を生き延びた人", description: "完璧ではない。でも、事実と宿題を残して一日を終えた。それで十分に前進だ。", requires: {} },
] as const;

export const LEARNING_ITEMS = [
  { id: "four-m", title: "4Mで変化点を確認する", description: "人・設備・材料・方法のどこが、正常時から変わったかを整理します。", href: "/tools/yield-dashboard" },
  { id: "spc", title: "SPCで異常発生時点を絞る", description: "平均値だけでなく時系列で見て、いつから工程が変わったかを探します。", href: "/tools/control-chart" },
  { id: "floor", title: "現場ヒアリングを記録と組み合わせる", description: "作業者の観察を手掛かりにし、時刻・ロット・変更履歴と照合します。", href: "/tools/yield-dashboard" },
  { id: "stratify", title: "装置別・ロット別に層別する", description: "全体平均に隠れた偏りを、意味のある単位へ分けて確認します。", href: "/tools/yield-analysis" },
  { id: "countermeasure", title: "対症療法と原因解析を分ける", description: "条件を戻して復旧することと、原因を検証して再発を防ぐことは別の仕事です。", href: "/tools/doe" },
] as const;
