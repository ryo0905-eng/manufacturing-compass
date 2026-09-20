"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import {
  GAME_LOCATIONS,
  type GameLocationId,
} from "@/data/process-engineer-survival";

type Direction = "down" | "left" | "right" | "up";

export type SurvivalCanvasHandle = {
  interact: () => void;
  setDirection: (direction: Direction, pressed: boolean) => void;
};

type Props = {
  activeLocationId: GameLocationId | null;
  paused: boolean;
  onInteract: (locationId: GameLocationId) => void;
  onNearbyChange: (locationId: GameLocationId | null) => void;
  onReady?: (handle: SurvivalCanvasHandle | null) => void;
};

const MAP_WIDTH = 800;
const MAP_HEIGHT = 480;

export function ProcessEngineerSurvivalCanvas({
  activeLocationId,
  paused,
  onInteract,
  onNearbyChange,
  onReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLocationRef = useRef(activeLocationId);
  const pausedRef = useRef(paused);
  const interactRef = useRef(onInteract);
  const nearbyChangeRef = useRef(onNearbyChange);
  const virtualDirectionsRef = useRef(new Set<Direction>());

  useEffect(() => { activeLocationRef.current = activeLocationId; }, [activeLocationId]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { interactRef.current = onInteract; }, [onInteract]);
  useEffect(() => { nearbyChangeRef.current = onNearbyChange; }, [onNearbyChange]);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let game: Phaser.Game | null = null;

    void import("phaser").then(({ default: PhaserRuntime }) => {
      if (cancelled || !containerRef.current) return;

      class RuntimeFactoryFloorScene extends PhaserRuntime.Scene {
        private player!: Phaser.Physics.Arcade.Sprite;
        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
        private actionKeys: Phaser.Input.Keyboard.Key[] = [];
        private shiftKey!: Phaser.Input.Keyboard.Key;
        private nearbyId: GameLocationId | null = null;
        private targetMarker!: Phaser.GameObjects.Graphics;
        private targetText!: Phaser.GameObjects.Text;
        private playerShadow!: Phaser.GameObjects.Ellipse;
        private walkFrame = 0;
        private lastWalkFrameAt = 0;

        constructor() {
          super("factory-floor");
        }

        create() {
          this.cameras.main.setBackgroundColor("#18212a");
          this.drawFloor();
          this.createTextures();
          this.drawFactoryDetails();

          const obstacles = this.physics.add.staticGroup();
          GAME_LOCATIONS.forEach((location) => {
            const texture = this.textureForLocation(location.id);
            this.add.ellipse(location.x + 4, location.y + location.height / 2 - 1, location.width * 0.88, 13, 0x10181d, 0.48).setDepth(1);
            const object = obstacles.create(location.x, location.y, texture) as Phaser.Physics.Arcade.Sprite;
            object.setDisplaySize(location.width, location.height).refreshBody();
            object.setDepth(2);

            this.add.text(location.x, location.y - location.height / 2 - 13, location.shortLabel, {
              backgroundColor: "#172229",
              color: "#eef6f2",
              fontFamily: "monospace",
              fontSize: "11px",
              fontStyle: "bold",
              padding: { x: 5, y: 2 },
              stroke: "#18212a",
              strokeThickness: 2,
            }).setOrigin(0.5).setDepth(4);

            if (location.kind === "person") {
              this.add.ellipse(location.x, location.y + 11, 17, 7, 0x10181d, 0.55).setDepth(3);
              this.add.image(location.x, location.y - 2, location.id === "boss" ? "npc-boss" : "npc-quality").setDepth(4);
            }

            if (location.kind === "machine") {
              const lightColor = location.id === "machine-b" ? 0xffbe55 : 0x69e397;
              const light = this.add.rectangle(location.x + location.width * 0.31, location.y - location.height * 0.24, 6, 6, lightColor).setDepth(5);
              this.tweens.add({ targets: light, alpha: { from: 1, to: .3 }, duration: location.id === "machine-b" ? 360 : 820, yoyo: true, repeat: -1 });
            }
          });

          this.playerShadow = this.add.ellipse(390, 256, 22, 8, 0x0b1014, 0.65).setDepth(4);
          this.player = this.physics.add.sprite(390, 242, "player-0").setDepth(5);
          this.player.setCollideWorldBounds(true);
          this.player.setSize(16, 20);
          this.physics.add.collider(this.player, obstacles);

          this.targetMarker = this.add.graphics().setDepth(3);
          this.targetText = this.add.text(0, 0, "!", {
            color: "#fff3a3",
            fontFamily: "monospace",
            fontSize: "20px",
            fontStyle: "bold",
            stroke: "#7b4a12",
            strokeThickness: 4,
          }).setOrigin(0.5).setDepth(6);

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasd = this.input.keyboard!.addKeys("W,A,S,D") as Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
          this.actionKeys = [
            this.input.keyboard!.addKey(PhaserRuntime.Input.Keyboard.KeyCodes.ENTER),
            this.input.keyboard!.addKey(PhaserRuntime.Input.Keyboard.KeyCodes.SPACE),
          ];
          this.shiftKey = this.input.keyboard!.addKey(PhaserRuntime.Input.Keyboard.KeyCodes.SHIFT);

          const handle: SurvivalCanvasHandle = {
            interact: () => this.interact(),
            setDirection: (direction, pressed) => {
              if (pressed) virtualDirectionsRef.current.add(direction);
              else virtualDirectionsRef.current.delete(direction);
            },
          };
          onReady?.(handle);
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

        private interact() {
          if (!pausedRef.current && this.nearbyId) interactRef.current(this.nearbyId);
        }

        update() {
          if (!this.player) return;
          const activeLocation = GAME_LOCATIONS.find((location) => location.id === activeLocationRef.current);
          this.targetMarker.clear();
          if (activeLocation) {
            const targetColor = this.nearbyId === activeLocation.id ? 0x77e5a0 : 0xffd85b;
            this.targetMarker.setAlpha(.72 + Math.sin(this.time.now / 150) * .2);
            this.targetMarker.lineStyle(3, targetColor, 0.95).strokeRoundedRect(
              activeLocation.x - activeLocation.width / 2 - 6,
              activeLocation.y - activeLocation.height / 2 - 6,
              activeLocation.width + 12,
              activeLocation.height + 12,
              4,
            );
            this.targetText.setVisible(true).setColor(this.nearbyId === activeLocation.id ? "#8dffae" : "#fff3a3").setPosition(activeLocation.x, activeLocation.y - activeLocation.height / 2 - 34 + Math.sin(this.time.now / 130) * 3);
          } else {
            this.targetText.setVisible(false);
          }

          if (pausedRef.current) {
            this.player.setVelocity(0);
            this.player.setTexture("player-0");
            return;
          }

          const directions = virtualDirectionsRef.current;
          const left = this.cursors.left.isDown || this.wasd.A.isDown || directions.has("left");
          const right = this.cursors.right.isDown || this.wasd.D.isDown || directions.has("right");
          const up = this.cursors.up.isDown || this.wasd.W.isDown || directions.has("up");
          const down = this.cursors.down.isDown || this.wasd.S.isDown || directions.has("down");
          const velocity = new PhaserRuntime.Math.Vector2(Number(right) - Number(left), Number(down) - Number(up));
          const isMoving = velocity.lengthSq() > 0;
          if (isMoving) velocity.normalize().scale(this.shiftKey.isDown ? 285 : 220);
          this.player.setVelocity(velocity.x, velocity.y);
          this.playerShadow.setPosition(this.player.x + 1, this.player.y + 14);
          if (velocity.x !== 0) this.player.setFlipX(velocity.x < 0);
          if (isMoving && this.time.now - this.lastWalkFrameAt > 95) {
            this.walkFrame = this.walkFrame === 0 ? 1 : 0;
            this.player.setTexture(`player-${this.walkFrame}`);
            this.lastWalkFrameAt = this.time.now;
          } else if (!isMoving) {
            this.walkFrame = 0;
            this.player.setTexture("player-0");
          }

          const nearest = GAME_LOCATIONS
            .map((location) => ({
              id: location.id,
              distance: PhaserRuntime.Math.Distance.Between(this.player.x, this.player.y, location.x, location.y),
              threshold: Math.max(location.width, location.height) / 2 + 54,
            }))
            .filter((candidate) => candidate.distance <= candidate.threshold)
            .sort((a, b) => a.distance - b.distance)[0]?.id ?? null;

          if (nearest !== this.nearbyId) {
            this.nearbyId = nearest;
            nearbyChangeRef.current(nearest);
          }

          if (this.actionKeys.some((key) => PhaserRuntime.Input.Keyboard.JustDown(key))) this.interact();
        }
      }

      game = new PhaserRuntime.Game({
        type: PhaserRuntime.AUTO,
        parent: containerRef.current,
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        backgroundColor: "#18212a",
        pixelArt: true,
        roundPixels: true,
        physics: { default: "arcade", arcade: { debug: false } },
        scale: { mode: PhaserRuntime.Scale.FIT, autoCenter: PhaserRuntime.Scale.CENTER_BOTH },
        scene: RuntimeFactoryFloorScene,
        input: { keyboard: true, touch: true },
      });
    });

    return () => {
      cancelled = true;
      virtualDirectionsRef.current.clear();
      onReady?.(null);
      game?.destroy(true);
    };
  }, [onReady]);

  return <div ref={containerRef} className="survival-canvas" aria-label="工場フロアのゲーム画面" />;
}
