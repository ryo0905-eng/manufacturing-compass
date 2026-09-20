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
        private nearbyId: GameLocationId | null = null;
        private targetMarker!: Phaser.GameObjects.Graphics;
        private targetText!: Phaser.GameObjects.Text;

        constructor() {
          super("factory-floor");
        }

        create() {
          this.cameras.main.setBackgroundColor("#18212a");
          this.drawFloor();
          this.createTextures();

          const obstacles = this.physics.add.staticGroup();
          GAME_LOCATIONS.forEach((location) => {
            const texture = location.kind === "machine" ? "machine" : location.kind === "pc" ? "pc" : location.kind === "person" ? "desk" : "room";
            const object = obstacles.create(location.x, location.y, texture) as Phaser.Physics.Arcade.Sprite;
            object.setDisplaySize(location.width, location.height).refreshBody();
            object.setDepth(2);

            this.add.text(location.x, location.y - location.height / 2 - 13, location.shortLabel, {
              color: "#dce8e8",
              fontFamily: "monospace",
              fontSize: "12px",
              fontStyle: "bold",
              stroke: "#18212a",
              strokeThickness: 3,
            }).setOrigin(0.5).setDepth(4);

            if (location.kind === "person") {
              this.add.image(location.x, location.y - 4, "npc").setDepth(4);
            }
          });

          this.player = this.physics.add.sprite(390, 242, "player").setDepth(5);
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
          graphics.fillStyle(0x2d3a42, 1).fillRect(18, 18, MAP_WIDTH - 36, MAP_HEIGHT - 36);
          graphics.lineStyle(1, 0x3d4b52, 0.55);
          for (let x = 20; x < MAP_WIDTH - 20; x += 32) graphics.lineBetween(x, 20, x, MAP_HEIGHT - 20);
          for (let y = 20; y < MAP_HEIGHT - 20; y += 32) graphics.lineBetween(20, y, MAP_WIDTH - 20, y);
          graphics.lineStyle(5, 0x9a9b8f, 1).strokeRect(16, 16, MAP_WIDTH - 32, MAP_HEIGHT - 32);
          graphics.lineStyle(2, 0xe0c65d, 0.7).lineBetween(32, 238, MAP_WIDTH - 32, 238);
          this.add.text(34, 218, "SAFE WALKWAY", { color: "#d8bf5b", fontFamily: "monospace", fontSize: "10px" });
        }

        private createTextures() {
          const graphics = this.make.graphics({ x: 0, y: 0 });

          graphics.fillStyle(0x4d6672).fillRect(0, 0, 32, 24);
          graphics.fillStyle(0x78a1a9).fillRect(3, 3, 26, 8);
          graphics.fillStyle(0xe3b94e).fillRect(5, 15, 7, 5);
          graphics.fillStyle(0xc85b52).fillRect(20, 15, 7, 5);
          graphics.generateTexture("machine", 32, 24).clear();

          graphics.fillStyle(0x826b53).fillRect(0, 0, 28, 20);
          graphics.fillStyle(0xc1ad8d).fillRect(2, 2, 24, 4);
          graphics.generateTexture("desk", 28, 20).clear();

          graphics.fillStyle(0x405264).fillRect(0, 0, 28, 22);
          graphics.fillStyle(0x78d1cf).fillRect(4, 3, 20, 11);
          graphics.fillStyle(0x202a31).fillRect(8, 17, 12, 3);
          graphics.generateTexture("pc", 28, 22).clear();

          graphics.fillStyle(0x59636b).fillRect(0, 0, 32, 24);
          graphics.lineStyle(3, 0xa5b0b6).strokeRect(2, 2, 28, 20);
          graphics.generateTexture("room", 32, 24).clear();

          graphics.fillStyle(0x244b70).fillRect(4, 9, 12, 11);
          graphics.fillStyle(0xe5b990).fillRect(6, 2, 8, 8);
          graphics.fillStyle(0xf2e0bf).fillRect(7, 3, 6, 3);
          graphics.fillStyle(0x25333d).fillRect(4, 20, 5, 4).fillRect(11, 20, 5, 4);
          graphics.generateTexture("player", 20, 24).clear();

          graphics.fillStyle(0x815741).fillRect(4, 8, 10, 10);
          graphics.fillStyle(0xe0ad82).fillRect(5, 1, 8, 8);
          graphics.fillStyle(0x20282e).fillRect(4, 18, 4, 3).fillRect(10, 18, 4, 3);
          graphics.generateTexture("npc", 18, 21);
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
            this.targetMarker.lineStyle(3, 0xffd85b, 0.9).strokeRoundedRect(
              activeLocation.x - activeLocation.width / 2 - 6,
              activeLocation.y - activeLocation.height / 2 - 6,
              activeLocation.width + 12,
              activeLocation.height + 12,
              4,
            );
            this.targetText.setVisible(true).setPosition(activeLocation.x, activeLocation.y - activeLocation.height / 2 - 34);
          } else {
            this.targetText.setVisible(false);
          }

          if (pausedRef.current) {
            this.player.setVelocity(0);
            return;
          }

          const directions = virtualDirectionsRef.current;
          const left = this.cursors.left.isDown || this.wasd.A.isDown || directions.has("left");
          const right = this.cursors.right.isDown || this.wasd.D.isDown || directions.has("right");
          const up = this.cursors.up.isDown || this.wasd.W.isDown || directions.has("up");
          const down = this.cursors.down.isDown || this.wasd.S.isDown || directions.has("down");
          const velocity = new PhaserRuntime.Math.Vector2(Number(right) - Number(left), Number(down) - Number(up));
          if (velocity.lengthSq() > 0) velocity.normalize().scale(145);
          this.player.setVelocity(velocity.x, velocity.y);

          const nearest = GAME_LOCATIONS
            .map((location) => ({
              id: location.id,
              distance: PhaserRuntime.Math.Distance.Between(this.player.x, this.player.y, location.x, location.y),
              threshold: Math.max(location.width, location.height) / 2 + 42,
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
