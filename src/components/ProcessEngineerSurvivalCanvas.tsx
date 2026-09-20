"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import { GAME_LOCATIONS, RULES, type GameLocationId } from "@/data/process-engineer-survival";
import { hintTarget, workDuration, type SurvivalRuntime } from "@/lib/process-engineer-survival";

export type Direction = "down" | "left" | "right" | "up";
export type SurvivalCanvasHandle = {
  setDirection: (direction: Direction, pressed: boolean) => void;
  setAction: (pressed: boolean) => void;
  dash: () => void;
  clear: () => void;
};
type Props = {
  runtime: SurvivalRuntime;
  onReady: (handle: SurvivalCanvasHandle | null) => void;
  onNearbyChange: (location: GameLocationId | null) => void;
  onError: () => void;
};
const MAP_WIDTH = 800;
const MAP_HEIGHT = 480;

export function ProcessEngineerSurvivalCanvas({ runtime, onReady, onNearbyChange, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let game: Phaser.Game | null = null;
    const directions = new Set<Direction>();
    const keys = new Set<string>();
    let touchAction = false;
    let wasHeld = false;
    let dashQueued = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clear = () => {
      directions.clear(); keys.clear(); touchAction = false; wasHeld = false; dashQueued = false;
      runtime.stop();
    };
    const unsubscribe = runtime.subscribe(() => {
      if (runtime.getState().phase !== "playing") clear();
    });
    const keydown = (event: KeyboardEvent) => {
      if (runtime.getState().phase !== "playing" || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof HTMLElement) {
        if (event.target.closest("input, select, textarea")) return;
        // Toolbar focus must not strand movement; Enter/Space still activate its buttons.
        if (event.target.closest("button, a") && (event.code === "Enter" || event.code === "Space")) return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD", "Space", "Enter", "ShiftLeft", "ShiftRight"].includes(event.code)) return;
      event.preventDefault();
      keys.add(event.code);
      if (event.code.startsWith("Shift") && !event.repeat) dashQueued = true;
    };
    const keyup = (event: KeyboardEvent) => { keys.delete(event.code); };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    void import("phaser").then(({ default: P }) => {
      if (cancelled || !containerRef.current) return;
      class Floor extends P.Scene {
        private player!: Phaser.Physics.Arcade.Sprite;
        private playerShadow!: Phaser.GameObjects.Ellipse;
        private marks!: Phaser.GameObjects.Graphics;
        private statusLabels = new Map<GameLocationId, Phaser.GameObjects.Text>();
        private machines = new Map<GameLocationId, Phaser.Physics.Arcade.Sprite>();
        private warningLights = new Map<GameLocationId, Phaser.GameObjects.Rectangle>();
        private products = new Map<GameLocationId, Phaser.GameObjects.Rectangle>();
        private nearby: GameLocationId | null = null;
        private serial = 0;
        private facing = new P.Math.Vector2(0, -1);
        private dashVector = new P.Math.Vector2(0, -1);
        constructor() { super("factory-action"); }
        create() {
          this.drawFloor(); this.createTextures(); this.drawFactoryDetails();
          this.physics.world.setBounds(26, 26, MAP_WIDTH - 52, MAP_HEIGHT - 52);
          const obstacles = this.physics.add.staticGroup();
          GAME_LOCATIONS.forEach(location => {
            this.add.ellipse(location.x + 4, location.y + location.height / 2, location.width * .9, 12, 0x10181d, .5);
            const object = obstacles.create(location.x, location.y, this.textureForLocation(location.id)) as Phaser.Physics.Arcade.Sprite;
            object.setDisplaySize(location.width, location.height).refreshBody().setDepth(2);
            this.machines.set(location.id, object);
            this.add.text(location.x, location.y - location.height / 2 - 15, location.shortLabel, {
              backgroundColor: "#172229", color: "#eef6f2", fontFamily: "monospace", fontSize: "12px", padding: { x: 4, y: 2 },
            }).setOrigin(.5).setDepth(4);
            this.statusLabels.set(location.id, this.add.text(location.x, location.y + location.height / 2 + 13, "", {
              backgroundColor: "#172229", color: "#a9e8c0", fontFamily: "monospace", fontSize: "11px", padding: { x: 3, y: 2 },
            }).setOrigin(.5).setDepth(7));
            if (location.kind === "person") this.add.image(location.x, location.y, location.id === "boss" ? "npc-boss" : "npc-quality").setDepth(4);
            if (location.kind === "machine" || location.id === "meeting") {
              this.warningLights.set(location.id, this.add.rectangle(location.x + 40, location.y - 13, 6, 6, 0x69e397).setDepth(4));
              this.products.set(location.id, this.add.rectangle(location.x - 40, location.y + 10, 9, 5, 0xb0ddd7).setDepth(4));
            }
          });
          this.playerShadow = this.add.ellipse(145, 202, 22, 8, 0x0b1014, .65).setDepth(4);
          this.player = this.physics.add.sprite(145, 190, "player-0").setDepth(5);
          this.player.setCollideWorldBounds(true).setSize(16, 18);
          this.physics.add.collider(this.player, obstacles);
          this.marks = this.add.graphics().setDepth(6);
          onReady({
            clear,
            setDirection: (direction, pressed) => { if (pressed) directions.add(direction); else directions.delete(direction); },
            setAction: pressed => { touchAction = pressed; },
            dash: () => { dashQueued = true; },
          });
        }
        private drawFloor() {
          const graphics = this.add.graphics();
          graphics.fillStyle(0x26343c, 1).fillRect(18, 18, MAP_WIDTH - 36, MAP_HEIGHT - 36);
          for (let y = 20; y < MAP_HEIGHT - 20; y += 32) {
            for (let x = 20; x < MAP_WIDTH - 20; x += 32) {
              graphics.fillStyle((x / 32 + y / 32) % 2 === 0 ? 0x2c3b43 : 0x293840, 1).fillRect(x, y, 31, 31);
            }
          }
          graphics.lineStyle(1, 0x405058, 0.5);
          for (let x = 20; x < MAP_WIDTH - 20; x += 32) graphics.lineBetween(x, 20, x, MAP_HEIGHT - 20);
          for (let y = 20; y < MAP_HEIGHT - 20; y += 32) graphics.lineBetween(20, y, MAP_WIDTH - 20, y);
          graphics.fillStyle(0x3a4748, 1).fillRect(28, 218, MAP_WIDTH - 56, 52);
          graphics.lineStyle(3, 0xe0c65d, 0.85).lineBetween(30, 218, MAP_WIDTH - 30, 218).lineBetween(30, 270, MAP_WIDTH - 30, 270);
          for (let x = 38; x < MAP_WIDTH - 40; x += 38) {
            graphics.lineStyle(2, 0xe0c65d, .3).lineBetween(x, 219, x + 22, 269);
          }
          graphics.lineStyle(6, 0x9a9b8f, 1).strokeRect(15, 15, MAP_WIDTH - 30, MAP_HEIGHT - 30);
          graphics.lineStyle(2, 0x59686f, 1).strokeRect(22, 22, MAP_WIDTH - 44, MAP_HEIGHT - 44);
          this.add.text(38, 229, "SAFE WALKWAY  →", { backgroundColor: "#263438", color: "#f0d45f", fontFamily: "monospace", fontSize: "9px", padding: { x: 4, y: 2 } }).setDepth(1);
        }

        private drawFactoryDetails() {
          const details = this.add.graphics().setDepth(1);
          details.lineStyle(7, 0x526570, 1).lineBetween(36, 52, 764, 52);
          details.lineStyle(3, 0x8ca1aa, 1).lineBetween(36, 49, 764, 49);
          for (let x = 70; x < 760; x += 112) {
            details.fillStyle(0x1a242b, 1).fillRect(x, 42, 18, 18);
            details.fillStyle(0x7d9299, 1).fillRect(x + 4, 46, 10, 3);
          }
          details.fillStyle(0xb6a153, .9);
          [[48, 290], [748, 290], [214, 185], [575, 185]].forEach(([x, y]) => {
            details.fillTriangle(x, y + 14, x + 8, y, x + 16, y + 14);
            details.fillStyle(0x27343b, 1).fillRect(x + 5, y + 7, 6, 2);
            details.fillStyle(0xb6a153, .9);
          });
          details.fillStyle(0x805f42, 1).fillRect(32, 394, 48, 34);
          details.lineStyle(2, 0xc09865, 1).strokeRect(32, 394, 48, 34).lineBetween(32, 411, 80, 411);
          details.fillStyle(0x586970, 1).fillRect(721, 391, 42, 30);
          details.lineStyle(2, 0x8da0a6, 1).strokeRect(721, 391, 42, 30);
          this.add.text(33, 433, "PALLET", { color: "#9dabaf", fontFamily: "monospace", fontSize: "8px" });
        }

        private textureForLocation(locationId: GameLocationId) {
          if (locationId.startsWith("machine-")) return locationId;
          if (locationId === "analysis-pc") return "analysis-pc";
          if (locationId === "meeting") return "meeting-room";
          if (locationId === "break-room") return "break-room";
          return locationId === "boss" ? "boss-desk" : "quality-desk";
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


        private inRange(location: GameLocationId) {
          const l = GAME_LOCATIONS.find(item => item.id === location)!;
          const dx = Math.max(0, Math.abs(this.player.x - l.x) - l.width / 2);
          const dy = Math.max(0, Math.abs(this.player.y - l.y) - l.height / 2);
          return Math.hypot(dx, dy) <= 34;
        }
        private celebrate() {
          const state = runtime.getState();
          const notice = state.notice;
          if (!notice || this.serial === notice.serial) return;
          this.serial = notice.serial;
          const location = GAME_LOCATIONS.find(l => l.id === notice.location)!;
          const label = this.add.text(location.x, location.y - 22,
            notice.kind === "repair" ? `復旧！ +${notice.points}  ×${notice.combo}` : notice.kind === "hint" ? "ヒント入手！" : "回復！",
            { fontFamily: "monospace", fontSize: "15px", color: "#fff3a3", backgroundColor: "#15352b", padding: { x: 5, y: 4 } }).setOrigin(.5).setDepth(10);
          this.tweens.add({ targets: label, y: motion.matches ? label.y : label.y - 22, alpha: 0, duration: 1100, onComplete: () => label.destroy() });
          if (!motion.matches) {
            for (let index = 0; index < 6 + notice.combo * 2; index++) {
              const pixel = this.add.rectangle(location.x, location.y, 4, 4, index % 2 ? 0xffdb6c : 0x81e3b2).setDepth(9);
              const angle = index * 2.4;
              this.tweens.add({ targets: pixel, x: location.x + Math.cos(angle) * 45, y: location.y + Math.sin(angle) * 35,
                alpha: 0, duration: 450, onComplete: () => pixel.destroy() });
            }
          }
        }
        update(_time: number, delta: number) {
          if (!this.player) return;
          let state = runtime.getState();
          if (state.phase !== "playing") {
            this.player.setVelocity(0);
            this.tweens.pauseAll();
            return;
          }
          this.tweens.resumeAll();
          const vector = new P.Math.Vector2(
            Number(keys.has("ArrowRight") || keys.has("KeyD") || directions.has("right")) - Number(keys.has("ArrowLeft") || keys.has("KeyA") || directions.has("left")),
            Number(keys.has("ArrowDown") || keys.has("KeyS") || directions.has("down")) - Number(keys.has("ArrowUp") || keys.has("KeyW") || directions.has("up")),
          );
          if (vector.lengthSq()) { vector.normalize(); this.facing.copy(vector); }
          if (dashQueued) {
            if (state.elapsed >= state.dashReadyAt) this.dashVector.copy(this.facing);
            runtime.dash(); dashQueued = false; state = runtime.getState();
          }
          const dashing = state.elapsed < state.dashUntil;
          const velocity = dashing ? this.dashVector.clone().scale(RULES.dashSpeed) : vector.scale(RULES.walkSpeed);
          this.player.setVelocity(velocity.x, velocity.y);
          this.player.setTexture(velocity.lengthSq() && !motion.matches ? `player-${Math.floor(state.elapsed * 11) % 2}` : "player-0");
          if (velocity.x) this.player.setFlipX(velocity.x < 0);
          this.playerShadow.setPosition(this.player.x + 1, this.player.y + 14);
          if (dashing && !motion.matches) this.player.setTint(0xb4f6ff); else this.player.clearTint();
          const nearest = GAME_LOCATIONS.filter(l => this.inRange(l.id)).sort((a, b) =>
            Math.hypot(this.player.x - a.x, this.player.y - a.y) - Math.hypot(this.player.x - b.x, this.player.y - b.y))[0]?.id ?? null;
          if (nearest !== this.nearby) { this.nearby = nearest; onNearbyChange(nearest); }
          const held = touchAction || keys.has("Space") || keys.has("Enter");
          if (state.work && (!held || !this.inRange(state.work.location))) runtime.stop();
          if (held && !wasHeld) runtime.begin(nearest);
          wasHeld = held;
          // Physics uses fixed 60Hz steps. Bound catch-up to avoid teleporting after a stalled frame.
          runtime.tick(Math.min(delta / 1000, .1));
          state = runtime.getState();
          this.marks.clear();
          GAME_LOCATIONS.forEach(location => {
            const task = state.tasks.find(t => t.location === location.id);
            const label = this.statusLabels.get(location.id)!;
            const light = this.warningLights.get(location.id);
            if (task) {
              const color = task.overdue ? 0xff8372 : 0xffd85b;
              const seconds = Math.max(0, Math.ceil(RULES.deadline - (state.elapsed - task.born)));
              label.setText(task.overdue ? "! 停止 / 要対応" : `! 警告 ${seconds}s`).setColor(task.overdue ? "#ff998b" : "#ffe68c");
              this.marks.lineStyle(2, color).strokeRect(location.x - location.width / 2 - 4, location.y - location.height / 2 - 4, location.width + 8, location.height + 8);
              light?.setFillStyle(color).setAlpha(motion.matches ? 1 : .7 + .3 * Math.sin(state.elapsed * 7));
              this.machines.get(location.id)?.setTint(task.overdue ? 0xe0aaaa : 0xffffff);
              const duration = state.hints.includes(task.location) ? RULES.hintedRepair : RULES.repair;
              this.marks.fillStyle(0x142128).fillRect(location.x - 35, location.y + 8, 70, 6);
              this.marks.fillStyle(0x81e3b2).fillRect(location.x - 35, location.y + 8, 70 * Math.min(1, task.progress / duration), 6);
            } else {
              light?.setFillStyle(0x69e397).setAlpha(1);
              this.machines.get(location.id)?.clearTint();
              if (location.id === "quality" || location.id === "analysis-pc") {
                const target = hintTarget(state, location.id);
                label.setText(target ? `◆ ${GAME_LOCATIONS.find(l => l.id === target.location)?.shortLabel} 1秒` : "◆ 調査待ち").setColor("#9fdcff");
              } else if (location.id === "break-room") {
                label.setText(state.elapsed < state.restReadyAt ? `休憩あと${Math.ceil(state.restReadyAt - state.elapsed)}s` : "♥ 休憩 2秒").setColor("#a9e8c0");
              } else label.setText(location.id === "boss" ? "定時まで頼んだ！" : "稼働中 ▶").setColor("#a9e8c0");
            }
            const product = this.products.get(location.id);
            if (product) {
              product.setVisible(!task);
              if (!task) product.x = location.x - 38 + (motion.matches ? 30 : state.elapsed * 28 % 76);
            }
          });
          if (state.work) {
            this.marks.fillStyle(0x142128).fillRect(this.player.x - 18, this.player.y - 24, 36, 5);
            this.marks.fillStyle(0x81e3b2).fillRect(this.player.x - 18, this.player.y - 24, 36 * Math.min(1, state.work.progress / workDuration(state)), 5);
          }
          this.celebrate();
        }
      }
      game = new P.Game({
        type: P.AUTO, parent: containerRef.current, width: MAP_WIDTH, height: MAP_HEIGHT,
        backgroundColor: "#18212a", pixelArt: true, roundPixels: true,
        physics: { default: "arcade", arcade: { debug: false, fixedStep: true, fps: 60 } },
        scale: { mode: P.Scale.FIT, autoCenter: P.Scale.CENTER_BOTH },
        scene: Floor, audio: { noAudio: true }, input: { keyboard: false },
      });
    }).catch(() => { if (!cancelled) onError(); });
    return () => {
      cancelled = true; unsubscribe(); clear();
      window.removeEventListener("keydown", keydown); window.removeEventListener("keyup", keyup);
      onReady(null); game?.destroy(true);
    };
  }, [runtime, onReady, onNearbyChange, onError]);
  return <div ref={containerRef} className="survival-canvas" aria-label="工場フロア。設備に近づきACTIONを長押しして復旧" />;
}
