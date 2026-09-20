"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import { GAME_LOCATIONS, RULES, type GameLocationId } from "@/data/process-engineer-survival";
import { counts, isMachine, machineStatus, type GameState, type Product, type SurvivalRuntime } from "@/lib/process-engineer-survival";

export type Direction = "down" | "left" | "right" | "up";
export type SurvivalCanvasHandle = { setDirection: (direction: Direction, pressed: boolean) => void; action: () => void; dash: () => void; clear: () => void };
type Props = { runtime: SurvivalRuntime; onReady: (handle: SurvivalCanvasHandle | null) => void; onNearbyChange: (location: GameLocationId | null) => void; onError: () => void };
const MAP_WIDTH = 800, MAP_HEIGHT = 480;

export function ProcessEngineerSurvivalCanvas({ runtime, onReady, onNearbyChange, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let game: Phaser.Game | null = null;
    const directions = new Set<Direction>(), keys = new Set<string>();
    let actionQueued = false, dashQueued = false;
    let haltMotion = () => {};
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clear = () => { directions.clear(); keys.clear(); actionQueued = false; dashQueued = false; haltMotion(); };
    const unsubscribe = runtime.subscribe(() => { if (runtime.getState().phase !== "playing") clear(); });
    const keydown = (event: KeyboardEvent) => {
      if (runtime.getState().phase !== "playing" || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof HTMLElement) {
        if (event.target.closest("input, select, textarea")) return;
        if (event.target.closest("button, a") && (event.code === "Enter" || event.code === "Space")) return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD", "Space", "Enter", "ShiftLeft", "ShiftRight"].includes(event.code)) return;
      event.preventDefault(); keys.add(event.code);
      if (!event.repeat && event.code.startsWith("Shift")) dashQueued = true;
      if (!event.repeat && (event.code === "Space" || event.code === "Enter")) actionQueued = true;
    };
    const keyup = (event: KeyboardEvent) => { keys.delete(event.code); };
    window.addEventListener("keydown", keydown); window.addEventListener("keyup", keyup);
    void import("phaser").then(({ default: P }) => {
      if (cancelled || !containerRef.current) return;
      class Floor extends P.Scene {
        private player!: Phaser.Physics.Arcade.Sprite;
        private shadow!: Phaser.GameObjects.Ellipse;
        private marks!: Phaser.GameObjects.Graphics;
        private labels = new Map<GameLocationId, Phaser.GameObjects.Text>();
        private objects = new Map<GameLocationId, Phaser.Physics.Arcade.Sprite>();
        private products = new Map<number, Phaser.GameObjects.Text>();
        private goodLabel!: Phaser.GameObjects.Text;
        private badLabel!: Phaser.GameObjects.Text;
        private nearby: GameLocationId | null = null;
        private serial = 0;
        private facing = new P.Math.Vector2(0, -1);
        private dashVector = new P.Math.Vector2(0, -1);
        constructor() { super("factory-investigation"); }
        create() {
          this.drawFloor(); this.createTextures();
          this.physics.world.setBounds(26, 26, MAP_WIDTH - 52, MAP_HEIGHT - 52);
          const obstacles = this.physics.add.staticGroup();
          GAME_LOCATIONS.forEach(l => {
            const texture = isMachine(l.id) ? l.id : l.id === "analysis-pc" ? "analysis-pc" : l.id === "cooling" ? "machine-b" : l.id === "material" ? "break-room" : "quality-desk";
            this.add.ellipse(l.x + 4, l.y + l.height / 2, l.width * .9, 12, 0x10181d, .5);
            const object = obstacles.create(l.x, l.y, texture) as Phaser.Physics.Arcade.Sprite;
            object.setDisplaySize(l.width, l.height).refreshBody().setDepth(2); this.objects.set(l.id, object);
            this.add.text(l.x, l.y - l.height / 2 - 17, l.shortLabel, { color: "#eef6f2", backgroundColor: "#172229", fontFamily: "monospace", fontSize: "13px", padding: { x: 4, y: 2 } }).setOrigin(.5).setDepth(4);
            this.labels.set(l.id, this.add.text(l.x, l.y + l.height / 2 + 15, "", { color: "#a9e8c0", backgroundColor: "#172229", fontFamily: "monospace", fontSize: "11px", padding: { x: 3, y: 2 } }).setOrigin(.5).setDepth(7));
            if (l.kind === "person") this.add.image(l.x, l.y, "npc-quality").setDepth(4);
          });
          this.goodLabel = this.add.text(700, 88, "○ 良品 0", { fontSize: "13px", color: "#a5ecc3", backgroundColor: "#172229", padding: { x: 4, y: 4 } }).setDepth(5);
          this.badLabel = this.add.text(700, 300, "× 保留 0", { fontSize: "13px", color: "#ffd19a", backgroundColor: "#172229", padding: { x: 4, y: 4 } }).setDepth(5);
          this.shadow = this.add.ellipse(302, 182, 22, 8, 0x0b1014, .65).setDepth(5);
          this.player = this.physics.add.sprite(302, 170, "player-0").setDepth(6).setCollideWorldBounds(true).setSize(16, 18);
          haltMotion = () => { this.player.setVelocity(0); this.physics.world.pause(); };
          this.physics.add.collider(this.player, obstacles);
          this.marks = this.add.graphics().setDepth(4);
          onReady({ clear, setDirection: (direction, pressed) => { if (pressed) directions.add(direction); else directions.delete(direction); },
            action: () => { actionQueued = true; }, dash: () => { dashQueued = true; } });
          this.drawState(runtime.getState());
        }
        private drawFloor() {
          const g = this.add.graphics();
          g.fillStyle(0x26343c).fillRect(18, 18, 764, 444);
          g.lineStyle(1, 0x405058, .5);
          for (let x = 20; x < 780; x += 32) g.lineBetween(x, 20, x, 460);
          for (let y = 20; y < 460; y += 32) g.lineBetween(20, y, 780, y);
          g.lineStyle(6, 0x9a9b8f).strokeRect(15, 15, 770, 450);
          // Neutral shared pipes are visible from the start; no hidden-cause highlight.
          g.lineStyle(8, 0x536a77).lineBetween(359, 238, 475, 238).lineBetween(475, 238, 475, 366).lineBetween(359, 366, 475, 366);
          g.lineStyle(2, 0xabc2cf).lineBetween(359, 235, 472, 235).lineBetween(472, 235, 472, 363).lineBetween(359, 363, 472, 363);
          for (const y of [112, 238, 366]) {
            g.lineStyle(12, 0x17262d, .8).lineBetween(128, y, 245, y).lineBetween(359, y, 547, y);
            for (let x = 138; x < 538; x += 32) {
              if (x > 235 && x < 363) continue;
              g.lineStyle(1, 0x6e8589).lineBetween(x, y - 5, x, y + 5);
            }
            this.add.text(191, y - 8, "→", { color: "#d8c577", fontSize: "18px" });
          }
          g.lineStyle(4, 0x66877b).lineBetween(644, 225, 725, 132);
          g.lineStyle(4, 0x8e7757).lineBetween(644, 249, 725, 300);
          this.add.text(39, 37, "材料 → 設備 A / B / C → 全数検査 → ○良品 / ×保留", { color: "#d3ded9", fontSize: "13px", fontFamily: "monospace" });
          this.add.text(42, 430, "製品の印：設備・材料ロット　T＝試験品（納入数に含めない）", { color: "#a5b8bb", fontSize: "12px", fontFamily: "monospace" });
          g.fillStyle(0x344e43).fillRect(700, 117, 61, 70);
          g.fillStyle(0x544333).fillRect(700, 330, 61, 65);
        }
        private createTextures() {
          const graphics = this.make.graphics({ x: 0, y: 0 });

          const createMachine = (key: string, body: number, accent: number, windowColor: number) => {
            graphics.fillStyle(0x182229).fillRect(2, 5, 60, 31);
            graphics.fillStyle(body).fillRect(0, 1, 60, 31);
            graphics.fillStyle(0xa8b7bb).fillRect(3, 4, 54, 3);
            graphics.fillStyle(accent).fillRect(4, 9, 7, 17);
            graphics.fillStyle(0x233039).fillRect(15, 10, 25, 14);
            graphics.fillStyle(windowColor).fillRect(18, 12, 19, 8);
            graphics.fillStyle(0x1a242b).fillRect(45, 10, 10, 4).fillRect(45, 17, 10, 2).fillRect(45, 22, 10, 2);
            graphics.fillStyle(0xd8b84c).fillRect(6, 28, 18, 3);
            graphics.fillStyle(0x202b31).fillRect(5, 32, 10, 4).fillRect(46, 32, 10, 4);
            graphics.generateTexture(key, 64, 38).clear();
          };
          createMachine("machine-a", 0x5d7882, 0x4c9c79, 0x8bd6d0);
          createMachine("machine-b", 0x536e7c, 0xd69a45, 0x77b8da);
          createMachine("machine-c", 0x65737b, 0xb65c54, 0xa7d090);

          const createDesk = (key: string, surface: number) => {
            graphics.fillStyle(0x1b242a).fillRect(2, 5, 44, 25);
            graphics.fillStyle(surface).fillRect(0, 0, 44, 24);
            graphics.fillStyle(0xd3c2a2).fillRect(3, 3, 19, 3);
            graphics.fillStyle(0x344752).fillRect(26, 3, 14, 10);
            graphics.fillStyle(0x75c9d2).fillRect(28, 5, 10, 6);
            graphics.fillStyle(0x253039).fillRect(6, 24, 5, 6).fillRect(34, 24, 5, 6);
            graphics.generateTexture(key, 48, 32).clear();
          };
          createDesk("quality-desk", 0x8b745b);
          createDesk("boss-desk", 0x715d4e);

          graphics.fillStyle(0x1a242b).fillRect(2, 5, 60, 35);
          graphics.fillStyle(0x4b5f6b).fillRect(0, 0, 60, 34);
          graphics.fillStyle(0x26343d).fillRect(5, 4, 21, 15).fillRect(34, 4, 21, 15);
          graphics.fillStyle(0x74d0d1).fillRect(8, 7, 15, 9);
          graphics.fillStyle(0x95bad8).fillRect(37, 7, 15, 9);
          graphics.fillStyle(0x202a31).fillRect(18, 23, 24, 5);
          graphics.fillStyle(0xc9d4d2).fillRect(22, 29, 16, 2);
          graphics.generateTexture("analysis-pc", 64, 42).clear();

          graphics.fillStyle(0x42515a).fillRect(0, 0, 64, 42);
          graphics.lineStyle(2, 0x7f9299).strokeRect(1, 1, 62, 40);
          graphics.fillStyle(0x806c58).fillRect(13, 10, 38, 20);
          graphics.fillStyle(0xb99e77).fillRect(16, 12, 32, 16);
          graphics.fillStyle(0x27333a).fillRect(5, 13, 6, 13).fillRect(53, 13, 6, 13).fillRect(20, 3, 8, 6).fillRect(36, 3, 8, 6).fillRect(20, 32, 8, 6).fillRect(36, 32, 8, 6);
          graphics.generateTexture("meeting-room", 64, 44).clear();

          graphics.fillStyle(0x4b5b61).fillRect(0, 0, 64, 42);
          graphics.lineStyle(2, 0x809097).strokeRect(1, 1, 62, 40);
          graphics.fillStyle(0xbec7c0).fillRect(5, 5, 17, 31);
          graphics.fillStyle(0x4c8fa1).fillRect(8, 8, 11, 13);
          graphics.fillStyle(0xb89462).fillRect(31, 18, 27, 13);
          graphics.fillStyle(0xe3d5a8).fillRect(35, 20, 9, 5);
          graphics.fillStyle(0x27333a).fillRect(34, 31, 4, 7).fillRect(52, 31, 4, 7);
          graphics.generateTexture("break-room", 64, 44).clear();

          const createPerson = (key: string, jacket: number, helmet: number) => {
            graphics.fillStyle(jacket).fillRect(4, 9, 12, 11);
            graphics.fillStyle(0xe5b990).fillRect(6, 3, 8, 7);
            graphics.fillStyle(helmet).fillRect(5, 1, 10, 4);
            graphics.fillStyle(0x172128).fillRect(7, 6, 2, 1).fillRect(12, 6, 2, 1);
            graphics.fillStyle(0x25333d).fillRect(4, 20, 5, 4).fillRect(11, 20, 5, 4);
            graphics.generateTexture(key, 20, 24).clear();
          };
          createPerson("npc-quality", 0x8d5d45, 0xe7cf67);
          createPerson("npc-boss", 0x4d5c7e, 0xd7dce0);

          const createPlayer = (key: string, alternate: boolean) => {
            graphics.fillStyle(0x23517b).fillRect(4, 9, 12, 11);
            graphics.fillStyle(0x5d9bc1).fillRect(5, 10, 10, 3);
            graphics.fillStyle(0xe5b990).fillRect(6, 3, 8, 7);
            graphics.fillStyle(0xf1e7c9).fillRect(5, 1, 10, 4);
            graphics.fillStyle(0x29404e).fillRect(4, 20, 5, alternate ? 3 : 5).fillRect(11, 20, 5, alternate ? 5 : 3);
            graphics.fillStyle(0xffd55b).fillRect(15, 11, 3, 6);
            graphics.generateTexture(key, 20, 26).clear();
          };
          createPlayer("player-0", false);
          createPlayer("player-1", true);
          graphics.destroy();
        }



        private inRange(id: GameLocationId) {
          const l = GAME_LOCATIONS.find(item => item.id === id)!;
          return Math.hypot(Math.max(0, Math.abs(this.player.x - l.x) - l.width / 2), Math.max(0, Math.abs(this.player.y - l.y) - l.height / 2)) <= 36;
        }
        private position(p: Product) {
          const l = GAME_LOCATIONS.find(item => item.id === p.machine)!;
          const t = Math.min(1, p.progress / (p.kind === "production" ? RULES.cycle : RULES.trial));
          const points = [{ x: 130, y: l.y - 7 }, { x: l.x, y: l.y - 7 }, { x: 535, y: l.y - 7 }, { x: 627, y: 235 }, { x: 730, y: p.quality === "bad" ? 350 : p.kind !== "production" ? 380 : 152 }];
          const section = Math.min(3, Math.floor(t * 4)), f = t * 4 - section;
          return { x: P.Math.Linear(points[section].x, points[section + 1].x, f), y: P.Math.Linear(points[section].y, points[section + 1].y, f) };
        }
        private drawState(s: GameState) {
          this.marks.clear();
          GAME_LOCATIONS.forEach(l => {
            const label = this.labels.get(l.id)!;
            if (isMachine(l.id)) {
              const m = s.machines[l.id];
              label.setText(machineStatus(s, l.id)).setColor(m.alarm ? "#ffd19a" : m.running ? "#a9e8c0" : "#ccd5df");
              this.objects.get(l.id)?.setTint(m.running ? (m.alarm ? 0xe8c39c : 0xffffff) : 0x9eafbd);
              this.marks.fillStyle(m.alarm ? 0xffbc75 : m.running ? 0x69e397 : 0x9fabb8).fillRect(l.x + 37, l.y - 12, 6, 6);
              const job = s.jobs.find(j => j.target === l.id || (j.target === "cooling" && l.id !== "machine-a"));
              if (job) {
                const duration = job.kind === "cooling" ? RULES.cooling : job.kind === "material" ? RULES.material : job.kind === "restart" ? RULES.restart : RULES.trial;
                this.marks.fillStyle(0x142128).fillRect(l.x - 40, l.y + 15, 80, 5);
                this.marks.fillStyle(0x9edfe0).fillRect(l.x - 40, l.y + 15, 80 * (1 - job.remaining / duration), 5);
              }
            } else label.setText(l.id === "cooling" ? (s.jobs.some(j => j.target === "cooling") ? "保全作業中" : "B/Cに接続") : l.id === "material" ? "ロット記録" : l.id === "quality" ? "観察・検査" : "比較・調査ノート");
            if (l.id === this.nearby) this.marks.lineStyle(2, 0xffe28a).strokeRect(l.x - l.width / 2 - 4, l.y - l.height / 2 - 4, l.width + 8, l.height + 8);
          });
          for (const p of s.products) {
            if (p.status !== "flowing") { this.products.get(p.id)?.destroy(); this.products.delete(p.id); continue; }
            let item = this.products.get(p.id);
            if (!item) {
              item = this.add.text(0, 0, "", { fontFamily: "monospace", fontSize: "11px", backgroundColor: "#dbded1", color: "#18292e", padding: { x: 3, y: 3 } }).setOrigin(.5).setDepth(8);
              this.products.set(p.id, item);
            }
            const point = this.position(p);
            item.setPosition(point.x, point.y).setText((p.quality === "bad" ? "×" : p.quality === "good" ? "○" : "□") + p.machine.slice(-1).toUpperCase() + "·" + p.lot + (p.kind === "production" ? "" : " T"));
          }
          const c = counts(s);
          this.goodLabel.setText("○ 良品 " + c.good); this.badLabel.setText("× 不良 " + c.bad + "\n□ 保留 " + c.held);
          for (let i = 0; i < Math.min(c.good, 20); i++) this.marks.fillStyle(0x91deb0).fillRect(704 + (i % 5) * 11, 176 - Math.floor(i / 5) * 12, 8, 8);
          for (let i = 0; i < Math.min(c.bad + c.held, 20); i++) this.marks.fillStyle(0xe5b782).fillRect(704 + (i % 5) * 11, 384 - Math.floor(i / 5) * 12, 8, 8);
          const n = s.notice;
          if (n && n.serial !== this.serial) {
            this.serial = n.serial;
            if (n.kind === "delivery") {
              const label = this.add.text(650, 165, "○ 良品、到着！", { color: "#fff3a3", backgroundColor: "#15352b", fontSize: "15px", padding: { x: 5, y: 4 } }).setDepth(10);
              this.tweens.add({ targets: label, y: motion.matches ? 165 : 143, alpha: 0, duration: 1300, onComplete: () => label.destroy() });
              if (!motion.matches) for (let i = 0; i < 8; i++) {
                const pixel = this.add.rectangle(728, 150, 4, 4, 0xffdb6c).setDepth(9);
                this.tweens.add({ targets: pixel, x: 728 + Math.cos(i) * 30, y: 150 + Math.sin(i) * 30, alpha: 0, duration: 450, onComplete: () => pixel.destroy() });
              }
            }
          }
        }
        update(_time: number, delta: number) {
          if (!this.player) return;
          let s = runtime.getState();
          this.drawState(s);
          if (s.phase !== "playing") { this.player.setVelocity(0); this.tweens.pauseAll(); return; }
          this.physics.world.resume();
          this.tweens.resumeAll();
          const vector = new P.Math.Vector2(
            Number(keys.has("ArrowRight") || keys.has("KeyD") || directions.has("right")) - Number(keys.has("ArrowLeft") || keys.has("KeyA") || directions.has("left")),
            Number(keys.has("ArrowDown") || keys.has("KeyS") || directions.has("down")) - Number(keys.has("ArrowUp") || keys.has("KeyW") || directions.has("up")));
          if (vector.lengthSq()) { vector.normalize(); this.facing.copy(vector); }
          if (dashQueued) {
            if (s.elapsed >= s.dashReadyAt) this.dashVector.copy(this.facing);
            runtime.dash(); dashQueued = false; s = runtime.getState();
          }
          const dashing = s.elapsed < s.dashUntil;
          const velocity = dashing ? this.dashVector.clone().scale(RULES.dashSpeed) : vector.scale(RULES.walkSpeed);
          this.player.setVelocity(velocity.x, velocity.y);
          this.player.setTexture(velocity.lengthSq() && !motion.matches ? "player-" + Math.floor(s.elapsed * 11) % 2 : "player-0");
          if (velocity.x) this.player.setFlipX(velocity.x < 0);
          this.shadow.setPosition(this.player.x + 1, this.player.y + 14);
          if (dashing && !motion.matches) this.player.setTint(0xb4f6ff); else this.player.clearTint();
          const nearest = GAME_LOCATIONS.filter(l => this.inRange(l.id)).sort((a, b) => Math.hypot(this.player.x - a.x, this.player.y - a.y) - Math.hypot(this.player.x - b.x, this.player.y - b.y))[0]?.id ?? null;
          if (nearest !== this.nearby) { this.nearby = nearest; onNearbyChange(nearest); }
          if (actionQueued) { actionQueued = false; if (nearest) runtime.open(nearest); }
          runtime.tick(Math.min(delta / 1000, .1));
        }
      }
      game = new P.Game({ type: P.AUTO, parent: containerRef.current, width: MAP_WIDTH, height: MAP_HEIGHT,
        backgroundColor: "#18212a", pixelArt: true, roundPixels: true,
        physics: { default: "arcade", arcade: { debug: false, fixedStep: true, fps: 60 } },
        scale: { mode: P.Scale.FIT, autoCenter: P.Scale.CENTER_BOTH }, scene: Floor, audio: { noAudio: true }, input: { keyboard: false } });
    }).catch(() => { if (!cancelled) onError(); });
    return () => { cancelled = true; unsubscribe(); clear(); window.removeEventListener("keydown", keydown); window.removeEventListener("keyup", keyup); onReady(null); game?.destroy(true); };
  }, [runtime, onReady, onNearbyChange, onError]);
  return <div ref={containerRef} className="survival-canvas" aria-label="材料から設備、検査、良品置場へ流れる工場。近づいてACTIONで操作" />;
}
