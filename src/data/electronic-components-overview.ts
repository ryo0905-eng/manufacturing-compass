import type { Source } from "@/types/content";

export const electronicComponentsOverview = {
  updatedAt: "2026-11-06",
  source: {
    title: "電子部品の役割・種類",
    url: "https://home.jeita.or.jp/ecb/about/part.html",
    publisher: "JEITA 電子部品部会",
    accessedAt: "2026-11-06",
  } satisfies Source,
  componentTypes: [
    {
      name: "受動部品",
      examples: "コンデンサ・インダクタ",
      role: "コンデンサは電気を蓄えて放出し、電圧の安定化などに使われます。インダクタは磁気エネルギーを蓄え、電圧の安定化や信号の選別などに使われます。",
      researchPoint: "部品の種類や材料、使用される機器と求められる特性を確認する。",
    },
    {
      name: "接続部品",
      examples: "コネクタ",
      role: "機器同士や機器内部の基板同士をつなぎ、電力や信号を伝えます。",
      researchPoint: "車載・産業機器などの用途や、接続先の機器を確認する。",
    },
    {
      name: "センサ",
      examples: "温度・圧力・磁気センサなど",
      role: "温度や圧力、磁気などを検知し、電気信号などに変換します。",
      researchPoint: "何を検知する製品か、どの機器に使われるかを確認する。",
    },
    {
      name: "電源機器",
      examples: "スイッチング電源",
      role: "入力された電源を制御・変換し、機器に必要な直流電源を得ます。",
      researchPoint: "電源の入力・出力条件や、用途となる機器を確認する。",
    },
  ],
} as const;
