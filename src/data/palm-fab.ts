export const fabBalance = {
  tickSeconds: 0.1,
  queueLimit: 6,
  transferSeconds: 1.2,
  wafersPerCase: 5,
  coinsPerCase: 10,
  startingCoins: 20,
  maxLevel: 4,
  goals: [25, 100, 250, 500, 1000],
  machines: {
    process: { name: "加工", role: "ウェハに模様をつくる", seconds: [5, 4.2, 3.4, 2.8], costs: [70, 130, 220] },
    wash: { name: "洗浄", role: "加工後のウェハをきれいにする", seconds: [6, 5, 4, 3.3], costs: [65, 120, 200] },
    inspect: { name: "検査", role: "完成前のウェハを確かめる", seconds: [13, 2.8, 2.3, 1.9], costs: [50, 110, 190] },
  },
} as const;

export type MachineId = keyof typeof fabBalance.machines;
export const machineIds: MachineId[] = ["process", "wash", "inspect"];
