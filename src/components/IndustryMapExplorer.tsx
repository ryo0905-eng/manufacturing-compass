"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode, WheelEvent as ReactWheelEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  industryMapCareers,
  industryMapCompanies,
  industryMapGroups,
  industryMapMetadata,
  industryMapProcesses,
  type IndustryMapCareer,
  type IndustryMapCompany,
  type IndustryMapGroup,
  type IndustryMapProcess,
  type IndustryMapProcessId,
} from "@/data/industry-map";
import { trackEvent } from "@/lib/analytics";

type ExplorerMode = "overview" | "companies" | "careers";
type ExplorerView = "map" | "list";

type CompanySummary = {
  id: string;
  slug: string;
  name: string;
  nameJa: string;
  summary: string;
  businessModel: string;
  mainProducts: string[];
  jobCategories: string[];
};

type IndustryMapExplorerProps = {
  companies: CompanySummary[];
  totalCompanyCount: number;
};

type Transform = {
  x: number;
  y: number;
  scale: number;
};

type Point = {
  x: number;
  y: number;
};

type MapNodeType = "process" | "group" | "company" | "career";

type MapBounds = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 730;
const MIN_SCALE = 0.55;
const MAX_SCALE = 1.35;
const FIT_PADDING = 24;
const NODE_HALF_SIZE: Record<MapNodeType, Point> = {
  process: { x: 86, y: 35 },
  group: { x: 86, y: 29 },
  company: { x: 69, y: 26 },
  career: { x: 86, y: 29 },
};

const modeOptions: Array<{ id: ExplorerMode; label: string; note: string }> = [
  { id: "overview", label: "全体像", note: "事業の役割" },
  { id: "companies", label: "企業", note: "代表企業" },
  { id: "careers", label: "職種", note: "経験との接点" },
];

const guideOptions: Array<{
  id: ExplorerMode;
  label: string;
  note: string;
  nodeId: string;
  nodeType: MapNodeType;
}> = [
  { id: "overview", label: "業界全体を知る", note: "事業の役割から眺める", nodeId: "fabless", nodeType: "group" },
  { id: "companies", label: "会社から調べる", note: "代表企業から工程を見る", nodeId: "tsmc", nodeType: "company" },
  { id: "careers", label: "自分の仕事から探す", note: "職種と工程の接点を見る", nodeId: "process-engineer", nodeType: "career" },
];

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

function nodeKey(type: "process" | "group" | "company" | "career", id: string) {
  return `${type}:${id}`;
}

function associationPath(from: Point, to: Point) {
  const direction = from.y < to.y ? 1 : -1;
  const bend = Math.min(120, Math.abs(to.y - from.y) * 0.42) * direction;
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + bend}, ${to.x} ${to.y - bend}, ${to.x} ${to.y}`;
}

function getMapBounds(mode: ExplorerMode, companies: IndustryMapCompany[]): MapBounds {
  const relationNodes: Array<Point & { type: MapNodeType }> = mode === "overview"
    ? industryMapGroups.map((item) => ({ type: "group", x: item.x, y: item.y }))
    : mode === "companies"
      ? companies.map((item) => ({ type: "company", x: item.x, y: item.y }))
      : industryMapCareers.map((item) => ({ type: "career", x: item.x, y: item.y }));
  const nodes: Array<Point & { type: MapNodeType }> = [
    ...industryMapProcesses.map((item) => ({ type: "process" as const, x: item.x, y: item.y })),
    ...relationNodes,
  ];
  const edges = nodes.reduce(
    (bounds, node) => {
      const halfSize = NODE_HALF_SIZE[node.type];
      return {
        bottom: Math.max(bounds.bottom, node.y + halfSize.y),
        left: Math.min(bounds.left, node.x - halfSize.x),
        right: Math.max(bounds.right, node.x + halfSize.x),
        top: Math.min(bounds.top, node.y - halfSize.y),
      };
    },
    { bottom: -Infinity, left: Infinity, right: -Infinity, top: Infinity },
  );
  const left = Math.max(0, edges.left);
  const top = Math.max(0, edges.top);
  const right = Math.min(CANVAS_WIDTH, edges.right);
  const bottom = Math.min(CANVAS_HEIGHT, edges.bottom);

  return {
    bottom,
    height: bottom - top,
    left,
    right,
    top,
    width: right - left,
  };
}

export function IndustryMapExplorer({ companies, totalCompanyCount }: IndustryMapExplorerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<{
    startTransform: Transform;
    startPointers: Point[];
  } | null>(null);
  const [mode, setMode] = useState<ExplorerMode>("overview");
  const [view, setView] = useState<ExplorerView>("map");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isPanning, setIsPanning] = useState(false);
  const [transform, setTransform] = useState<Transform>({ x: 16, y: 10, scale: 0.72 });

  const companiesById = useMemo(() => new Map(companies.map((company) => [company.id, company])), [companies]);
  const mapCompanies = useMemo(
    () => industryMapCompanies.filter((item) => companiesById.has(item.companyId)),
    [companiesById],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase("ja");
  const visibleCompanies = useMemo(() => {
    if (!normalizedQuery) {
      return mapCompanies;
    }

    return mapCompanies.filter((item) => {
      const company = companiesById.get(item.companyId);
      if (!company) {
        return false;
      }
      return [
        company.name,
        company.nameJa,
        company.businessModel,
        ...company.mainProducts,
        ...company.jobCategories,
      ].some((value) => value.toLocaleLowerCase("ja").includes(normalizedQuery));
    });
  }, [companiesById, mapCompanies, normalizedQuery]);

  const connectedKeys = useMemo(() => {
    if (!selectedKey) {
      return null;
    }

    const keys = new Set<string>([selectedKey]);
    const [type, id] = selectedKey.split(":");
    let processIds: IndustryMapProcessId[] = [];

    if (type === "process") {
      processIds = [id as IndustryMapProcessId];
      const processIndex = industryMapProcesses.findIndex((process) => process.id === id);
      if (processIndex > 0) {
        keys.add(nodeKey("process", industryMapProcesses[processIndex - 1].id));
      }
      if (processIndex < industryMapProcesses.length - 1) {
        keys.add(nodeKey("process", industryMapProcesses[processIndex + 1].id));
      }
    } else if (type === "group") {
      processIds = industryMapGroups.find((group) => group.id === id)?.processIds ?? [];
    } else if (type === "company") {
      processIds = mapCompanies.find((company) => company.companyId === id)?.processIds ?? [];
    } else if (type === "career") {
      processIds = industryMapCareers.find((career) => career.id === id)?.processIds ?? [];
    }

    processIds.forEach((processId) => keys.add(nodeKey("process", processId)));
    if (type === "process") {
      const items = mode === "overview" ? industryMapGroups : mode === "companies" ? visibleCompanies : industryMapCareers;
      items.forEach((item) => {
        if (item.processIds.includes(id as IndustryMapProcessId)) {
          const itemType = mode === "overview" ? "group" : mode === "companies" ? "company" : "career";
          const itemId = "companyId" in item ? item.companyId : item.id;
          keys.add(nodeKey(itemType, itemId));
        }
      });
    }

    return keys;
  }, [mapCompanies, mode, selectedKey, visibleCompanies]);

  const selected = useMemo(() => {
    if (!selectedKey) {
      return null;
    }
    const [type, id] = selectedKey.split(":");
    if (type === "process") {
      return { type, value: industryMapProcesses.find((process) => process.id === id) } as const;
    }
    if (type === "group") {
      return { type, value: industryMapGroups.find((group) => group.id === id) } as const;
    }
    if (type === "company") {
      return {
        type,
        value: mapCompanies.find((company) => company.companyId === id),
        company: companiesById.get(id),
      } as const;
    }
    return { type: "career", value: industryMapCareers.find((career) => career.id === id) } as const;
  }, [companiesById, mapCompanies, selectedKey]);

  const fitMap = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    const bounds = getMapBounds(mode, mapCompanies);

    if (width < 640) {
      const scale = 0.82;
      const centeredY = (height - bounds.height * scale) / 2 - bounds.top * scale;
      setTransform({ x: 16, y: mode === "overview" ? centeredY : 20, scale });
      return;
    }

    const scale = clampScale(Math.min(
      (width - FIT_PADDING * 2) / bounds.width,
      (height - FIT_PADDING * 2) / bounds.height,
    ));
    setTransform({
      scale,
      x: (width - bounds.width * scale) / 2 - bounds.left * scale,
      y: (height - bounds.height * scale) / 2 - bounds.top * scale,
    });
  }, [mapCompanies, mode]);

  useEffect(() => {
    if (view !== "map") {
      return;
    }
    fitMap();
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(() => fitMap());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [fitMap, view]);

  useEffect(() => {
    if (!selectedKey) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedKey(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedKey]);

  function changeMode(nextMode: ExplorerMode) {
    setMode(nextMode);
    setSelectedKey(null);
    if (nextMode !== "companies") {
      setQuery("");
    }
    trackEvent("industry_map_mode_change", { mode: nextMode });
  }

  function startGuide(nextMode: ExplorerMode, type: MapNodeType, id: string) {
    setMode(nextMode);
    setView("map");
    setSelectedKey(nodeKey(type, id));
    if (nextMode !== "companies") {
      setQuery("");
    }
    trackEvent("industry_map_guide_start", { mode: nextMode, node_id: id, node_type: type });
  }

  function changeView(nextView: ExplorerView) {
    setView(nextView);
    trackEvent("industry_map_view_change", { mode, view: nextView });
  }

  function selectNode(type: "process" | "group" | "company" | "career", id: string) {
    const key = nodeKey(type, id);
    setSelectedKey((current) => (current === key ? null : key));
    trackEvent("industry_map_node_open", { node_type: type, node_id: id, mode });
  }

  function zoomBy(factor: number) {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const centerX = viewport.clientWidth / 2;
    const centerY = viewport.clientHeight / 2;
    setTransform((current) => {
      const scale = clampScale(current.scale * factor);
      const ratio = scale / current.scale;
      return {
        scale,
        x: centerX - (centerX - current.x) * ratio,
        y: centerY - (centerY - current.y) * ratio,
      };
    });
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const rect = viewport.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    setTransform((current) => {
      const scale = clampScale(current.scale * (event.deltaY < 0 ? 1.08 : 0.92));
      const ratio = scale / current.scale;
      return {
        scale,
        x: pointerX - (pointerX - current.x) * ratio,
        y: pointerY - (pointerY - current.y) * ratio,
      };
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button, a, input")) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    gestureRef.current = {
      startTransform: transform,
      startPointers: Array.from(pointersRef.current.values()),
    };
    setIsPanning(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId) || !gestureRef.current) {
      return;
    }
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const currentPointers = Array.from(pointersRef.current.values());
    const { startPointers, startTransform } = gestureRef.current;

    if (currentPointers.length === 1 && startPointers.length === 1) {
      setTransform({
        ...startTransform,
        x: startTransform.x + currentPointers[0].x - startPointers[0].x,
        y: startTransform.y + currentPointers[0].y - startPointers[0].y,
      });
      return;
    }

    if (currentPointers.length >= 2 && startPointers.length >= 2) {
      const startDistance = Math.hypot(
        startPointers[1].x - startPointers[0].x,
        startPointers[1].y - startPointers[0].y,
      );
      const currentDistance = Math.hypot(
        currentPointers[1].x - currentPointers[0].x,
        currentPointers[1].y - currentPointers[0].y,
      );
      const startCenter = {
        x: (startPointers[0].x + startPointers[1].x) / 2,
        y: (startPointers[0].y + startPointers[1].y) / 2,
      };
      const currentCenter = {
        x: (currentPointers[0].x + currentPointers[1].x) / 2,
        y: (currentPointers[0].y + currentPointers[1].y) / 2,
      };
      const scale = clampScale(startTransform.scale * (currentDistance / Math.max(startDistance, 1)));
      const mapX = (startCenter.x - startTransform.x) / startTransform.scale;
      const mapY = (startCenter.y - startTransform.y) / startTransform.scale;
      setTransform({
        scale,
        x: currentCenter.x - mapX * scale,
        y: currentCenter.y - mapY * scale,
      });
    }
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size === 0) {
      gestureRef.current = null;
      setIsPanning(false);
      return;
    }
    gestureRef.current = {
      startTransform: transform,
      startPointers: Array.from(pointersRef.current.values()),
    };
  }

  function isNodeMuted(key: string) {
    return connectedKeys ? !connectedKeys.has(key) : false;
  }

  function edgeClass(fromKey: string, toKey: string) {
    if (!selectedKey) {
      return "";
    }
    return fromKey === selectedKey || toKey === selectedKey ? "is-active" : "is-muted";
  }

  function renderAssociationEdges(
    items: Array<IndustryMapGroup | IndustryMapCompany | IndustryMapCareer>,
    type: "group" | "company" | "career",
  ) {
    return items.flatMap((item) => {
      const id = "companyId" in item ? item.companyId : item.id;
      const fromKey = nodeKey(type, id);
      return item.processIds.map((processId) => {
        const process = industryMapProcesses.find((entry) => entry.id === processId);
        if (!process) {
          return null;
        }
        const toKey = nodeKey("process", processId);
        return (
          <path
            className={edgeClass(fromKey, toKey)}
            d={associationPath({ x: item.x, y: item.y }, { x: process.x, y: process.y })}
            key={`${fromKey}-${toKey}`}
          />
        );
      });
    });
  }

  return (
    <section className="industry-explorer" aria-labelledby="industry-explorer-title">
      <header className="industry-explorer__header">
        <div>
          <p className="section-label">Interactive ecosystem map</p>
          <h2 id="industry-explorer-title">工程をたどって、企業の役割をつかむ</h2>
          <p>横に流れる製造工程を背骨に、事業モデル、代表企業、職種との接点を切り替えて探索できます。</p>
        </div>
        <dl aria-label="地図の収録内容">
          <div><dt>工程</dt><dd>6</dd></div>
          <div><dt>視点</dt><dd>3</dd></div>
          <div><dt>代表表示</dt><dd>{mapCompanies.length}</dd></div>
          <div><dt>企業記事</dt><dd>{totalCompanyCount}</dd></div>
        </dl>
      </header>

      <div className="industry-explorer__starter" aria-label="探索の入口" role="group">
        {guideOptions.map((option, index) => (
          <button
            key={option.id}
            onClick={() => startGuide(option.id, option.nodeType, option.nodeId)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{option.label}</strong>
            <small>{option.note}</small>
            <i aria-hidden="true">→</i>
          </button>
        ))}
      </div>

      <div className="industry-explorer__toolbar">
        <div className="industry-explorer__modes" aria-label="地図の見方" role="group">
          {modeOptions.map((option) => (
            <button
              aria-pressed={mode === option.id}
              key={option.id}
              onClick={() => changeMode(option.id)}
              type="button"
            >
              <span>{option.label}</span>
              <small>{option.note}</small>
            </button>
          ))}
        </div>
        <div className="industry-explorer__view-toggle" aria-label="表示方法" role="group">
          <button aria-pressed={view === "map"} onClick={() => changeView("map")} type="button">地図</button>
          <button aria-pressed={view === "list"} onClick={() => changeView("list")} type="button">リスト</button>
        </div>
        {mode === "companies" ? (
          <label className="industry-explorer__search">
            <span className="sr-only">代表企業を検索</span>
            <i aria-hidden="true">⌕</i>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="企業名・製品・職種で検索"
              type="search"
              value={query}
            />
            {query ? <small>{visibleCompanies.length}件</small> : null}
          </label>
        ) : (
          <p className="industry-explorer__toolbar-note">ノードを選択。ドラッグで移動、ホイール・ピンチで拡大できます。</p>
        )}
      </div>

      <div className={`industry-explorer__workspace${selected ? " has-detail" : ""}${view === "list" ? " is-list-view" : ""}`}>
        <div
          aria-label="半導体産業つながりマップ。ドラッグで移動、ホイールまたは操作ボタンで拡大縮小できます。"
          className={`industry-explorer__viewport${isPanning ? " is-panning" : ""}`}
          onDoubleClick={() => zoomBy(1.12)}
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onWheel={handleWheel}
          ref={viewportRef}
          role="region"
          style={{
            "--industry-flow-y": `${transform.y + industryMapProcesses[0].y * transform.scale}px`,
          } as CSSProperties}
        >
          <div className="industry-explorer__canvas-label industry-explorer__canvas-label--top">
            {mode === "overview" ? "事業の役割" : mode === "companies" ? "代表企業" : "職種・経験の接点"}
          </div>
          <div className="industry-explorer__canvas-label industry-explorer__canvas-label--middle">製造工程</div>
          <div className="industry-explorer__canvas-label industry-explorer__canvas-label--bottom">
            {mode === "overview" ? "役割を選ぶと接点を強調" : mode === "companies" ? "企業を選ぶと関わる工程を強調" : "職種を選ぶと関わる工程を強調"}
          </div>

          <div
            className="industry-explorer__canvas"
            style={{
              height: CANVAS_HEIGHT,
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
              width: CANVAS_WIDTH,
            }}
          >
            <svg aria-hidden="true" className="industry-explorer__edges" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}>
              <defs>
                <marker id="industry-map-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5">
                  <path d="M 0 0 L 7 3.5 L 0 7 z" />
                </marker>
              </defs>
              <g className="industry-explorer__flow-edges">
                {industryMapProcesses.slice(0, -1).map((process, index) => {
                  const next = industryMapProcesses[index + 1];
                  const fromKey = nodeKey("process", process.id);
                  const toKey = nodeKey("process", next.id);
                  return (
                    <line
                      className={edgeClass(fromKey, toKey)}
                      key={`${process.id}-${next.id}`}
                      markerEnd="url(#industry-map-arrow)"
                      x1={process.x + 86}
                      x2={next.x - 94}
                      y1={process.y}
                      y2={next.y}
                    />
                  );
                })}
              </g>
              <g className={`industry-explorer__association-edges industry-explorer__association-edges--${mode}`}>
                {mode === "overview"
                  ? renderAssociationEdges(industryMapGroups, "group")
                  : mode === "companies"
                    ? renderAssociationEdges(visibleCompanies, "company")
                    : renderAssociationEdges(industryMapCareers, "career")}
              </g>
            </svg>

            {industryMapProcesses.map((process, index) => {
              const key = nodeKey("process", process.id);
              return (
                <button
                  aria-pressed={selectedKey === key}
                  className={`industry-explorer__node industry-explorer__node--process${selectedKey === key ? " is-selected" : ""}${isNodeMuted(key) ? " is-muted" : ""}`}
                  key={process.id}
                  onClick={() => selectNode("process", process.id)}
                  style={{ left: process.x, top: process.y }}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")} / {process.labelEn}</span>
                  <strong>{process.label}</strong>
                  <i aria-hidden="true">＋</i>
                </button>
              );
            })}

            {mode === "overview" ? industryMapGroups.map((group) => {
              const key = nodeKey("group", group.id);
              return (
                <MapRelationNode
                  active={selectedKey === key}
                  item={group}
                  key={group.id}
                  muted={isNodeMuted(key)}
                  onSelect={() => selectNode("group", group.id)}
                  type="group"
                />
              );
            }) : null}

            {mode === "companies" ? visibleCompanies.map((item) => {
              const company = companiesById.get(item.companyId);
              const key = nodeKey("company", item.companyId);
              if (!company) {
                return null;
              }
              return (
                <button
                  aria-pressed={selectedKey === key}
                  className={`industry-explorer__node industry-explorer__node--company${selectedKey === key ? " is-selected" : ""}${isNodeMuted(key) ? " is-muted" : ""}`}
                  key={item.companyId}
                  onClick={() => selectNode("company", item.companyId)}
                  style={{ left: item.x, top: item.y }}
                  type="button"
                >
                  <span>{company.businessModel}</span>
                  <strong>{company.nameJa}</strong>
                </button>
              );
            }) : null}

            {mode === "careers" ? industryMapCareers.map((career) => {
              const key = nodeKey("career", career.id);
              return (
                <MapRelationNode
                  active={selectedKey === key}
                  item={career}
                  key={career.id}
                  muted={isNodeMuted(key)}
                  onSelect={() => selectNode("career", career.id)}
                  type="career"
                />
              );
            }) : null}
          </div>

          <div className="industry-explorer__zoom" aria-label="地図の拡大縮小">
            <button aria-label="縮小" onClick={() => zoomBy(0.88)} type="button">−</button>
            <output aria-label="現在の倍率">{Math.round(transform.scale * 100)}%</output>
            <button aria-label="拡大" onClick={() => zoomBy(1.12)} type="button">＋</button>
            <button className="industry-explorer__fit" onClick={fitMap} type="button">全体</button>
          </div>

          {mode === "companies" && visibleCompanies.length === 0 ? (
            <div className="industry-explorer__empty">代表表示の企業には一致しませんでした。下の企業一覧も確認できます。</div>
          ) : null}
        </div>

        <IndustryMapMobileList
          companiesById={companiesById}
          mode={mode}
          onSelect={selectNode}
          selectedKey={selectedKey}
          visibleCompanies={visibleCompanies}
        />

        {selected ? (
          <MapDetailPanel
            companiesById={companiesById}
            mapCompanies={mapCompanies}
            onClose={() => setSelectedKey(null)}
            selected={selected}
          />
        ) : null}
      </div>

      <footer className="industry-explorer__footer">
        <ul aria-label="地図の凡例">
          <li><i className="is-process" />製造工程</li>
          <li><i className="is-relation" />{mode === "overview" ? "事業の役割" : mode === "companies" ? "代表企業" : "関連職種"}</li>
          <li><span aria-hidden="true">—</span>一般的な役割上の接点</li>
        </ul>
        <p>線は資本・取引関係や工程の厳密な順番を示すものではありません。{industryMapMetadata.basis}です。企業固有の事業は企業詳細と公式情報で確認してください。最終更新: {industryMapMetadata.lastUpdated}</p>
      </footer>
    </section>
  );
}

function MapRelationNode({
  active,
  item,
  muted,
  onSelect,
  type,
}: {
  active: boolean;
  item: IndustryMapGroup | IndustryMapCareer;
  muted: boolean;
  onSelect: () => void;
  type: "group" | "career";
}) {
  return (
    <button
      aria-pressed={active}
      className={`industry-explorer__node industry-explorer__node--${type}${active ? " is-selected" : ""}${muted ? " is-muted" : ""}`}
      onClick={onSelect}
      style={{ left: item.x, top: item.y }}
      type="button"
    >
      <span>{item.labelEn}</span>
      <strong>{item.label}</strong>
      <i aria-hidden="true">↘</i>
    </button>
  );
}

function MapDetailPanel({
  companiesById,
  mapCompanies,
  onClose,
  selected,
}: {
  companiesById: Map<string, CompanySummary>;
  mapCompanies: IndustryMapCompany[];
  onClose: () => void;
  selected:
    | { type: "process"; value: IndustryMapProcess | undefined }
    | { type: "group"; value: IndustryMapGroup | undefined }
    | { type: "company"; value: IndustryMapCompany | undefined; company: CompanySummary | undefined }
    | { type: "career"; value: IndustryMapCareer | undefined }
    | null;
}) {
  if (!selected || !selected.value) {
    return null;
  }

  if (selected.type === "process") {
    const process = selected.value;
    const relatedCompanies = mapCompanies
      .filter((item) => item.processIds.includes(process.id))
      .map((item) => companiesById.get(item.companyId))
      .filter((company): company is CompanySummary => company !== undefined)
      .slice(0, 4);
    return (
      <DetailPanelShell onClose={onClose}>
        <p className="section-label">{process.labelEn} / Process</p>
        <h3>{process.label}</h3>
        <p>{process.description}</p>
        {relatedCompanies.length > 0 ? (
          <div className="industry-explorer__detail-list">
            <span>この工程と接点のある代表企業</span>
            {relatedCompanies.map((company) => <small key={company.id}>{company.nameJa}</small>)}
          </div>
        ) : null}
        <Link
          className="industry-explorer__detail-link"
          href={process.guideHref as Route}
          onClick={() => trackEvent("industry_map_content_click", { destination: "guide", process: process.id })}
        >
          工程を記事で理解する <span aria-hidden="true">→</span>
        </Link>
      </DetailPanelShell>
    );
  }

  if (selected.type === "group") {
    const group = selected.value;
    return (
      <DetailPanelShell onClose={onClose}>
        <p className="section-label">{group.labelEn} / Industry role</p>
        <h3>{group.label}</h3>
        <p>{group.description}</p>
        <ProcessTags processIds={group.processIds} />
        {group.segmentId ? (
          <Link
            className="industry-explorer__detail-link"
            href={`/segments/${group.segmentId}` as Route}
            onClick={() => trackEvent("industry_map_content_click", { destination: "segment", segment: group.segmentId })}
          >
            この領域の企業を見る <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link className="industry-explorer__detail-link" href="/guides/semiconductor-manufacturing-process">
            製造工程の全体像を見る <span aria-hidden="true">→</span>
          </Link>
        )}
      </DetailPanelShell>
    );
  }

  if (selected.type === "company" && selected.company) {
    const company = selected.company;
    return (
      <DetailPanelShell onClose={onClose}>
        <p className="section-label">{company.name} / Company</p>
        <h3>{company.nameJa}</h3>
        <strong className="industry-explorer__detail-subtitle">{company.businessModel}</strong>
        <p>{company.summary}</p>
        <ProcessTags processIds={selected.value.processIds} />
        <div className="industry-explorer__detail-list">
          <span>主な製品・領域</span>
          {company.mainProducts.slice(0, 3).map((product) => <small key={product}>{product}</small>)}
        </div>
        <Link
          className="industry-explorer__detail-link"
          href={`/companies/${company.slug}` as Route}
          onClick={() => trackEvent("industry_map_content_click", { company_id: company.id, destination: "company" })}
        >
          企業情報を詳しく見る <span aria-hidden="true">→</span>
        </Link>
      </DetailPanelShell>
    );
  }

  const career = selected.value as IndustryMapCareer;
  return (
    <DetailPanelShell onClose={onClose}>
      <p className="section-label">{career.labelEn} / Career</p>
      <h3>{career.label}</h3>
      <p>{career.description}</p>
      <ProcessTags processIds={career.processIds} />
      <div className="industry-explorer__detail-actions">
        <Link
          className="industry-explorer__detail-link"
          href={`/companies?query=${encodeURIComponent(career.query)}` as Route}
          onClick={() => trackEvent("industry_map_content_click", { career_id: career.id, destination: "companies" })}
        >
          関連企業を探す <span aria-hidden="true">→</span>
        </Link>
        <Link
          className="industry-explorer__detail-secondary"
          href="/career-compass"
          onClick={() => trackEvent("industry_map_content_click", { career_id: career.id, destination: "career_compass" })}
        >
          経験の接点を整理する
        </Link>
      </div>
    </DetailPanelShell>
  );
}

function DetailPanelShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <aside className="industry-explorer__detail" aria-label="選択した要素の詳細" aria-live="polite">
      <button className="industry-explorer__detail-close" onClick={onClose} type="button">
        <span aria-hidden="true">×</span> 閉じる
      </button>
      {children}
    </aside>
  );
}

function IndustryMapMobileList({
  companiesById,
  mode,
  onSelect,
  selectedKey,
  visibleCompanies,
}: {
  companiesById: Map<string, CompanySummary>;
  mode: ExplorerMode;
  onSelect: (type: MapNodeType, id: string) => void;
  selectedKey: string | null;
  visibleCompanies: IndustryMapCompany[];
}) {
  const relationTitle = mode === "overview" ? "事業の役割" : mode === "companies" ? "代表企業" : "関連職種";

  return (
    <div className="industry-explorer__mobile-list">
      <section>
        <p className="section-label">Manufacturing flow</p>
        <h3>製造工程</h3>
        <ul>
          {industryMapProcesses.map((process, index) => {
            const key = nodeKey("process", process.id);
            return (
              <li key={process.id}>
                <button aria-pressed={selectedKey === key} onClick={() => onSelect("process", process.id)} type="button">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{process.label}</strong>
                  <i aria-hidden="true">→</i>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <p className="section-label">Explore by perspective</p>
        <h3>{relationTitle}</h3>
        <ul>
          {mode === "overview" ? industryMapGroups.map((group) => {
            const key = nodeKey("group", group.id);
            return (
              <li key={group.id}>
                <button aria-pressed={selectedKey === key} onClick={() => onSelect("group", group.id)} type="button">
                  <strong>{group.label}</strong>
                  <small>{group.description}</small>
                  <i aria-hidden="true">→</i>
                </button>
              </li>
            );
          }) : null}
          {mode === "companies" ? visibleCompanies.map((item) => {
            const company = companiesById.get(item.companyId);
            const key = nodeKey("company", item.companyId);
            return company ? (
              <li key={item.companyId}>
                <button aria-pressed={selectedKey === key} onClick={() => onSelect("company", item.companyId)} type="button">
                  <strong>{company.nameJa}</strong>
                  <small>{company.businessModel}</small>
                  <i aria-hidden="true">→</i>
                </button>
              </li>
            ) : null;
          }) : null}
          {mode === "careers" ? industryMapCareers.map((career) => {
            const key = nodeKey("career", career.id);
            return (
              <li key={career.id}>
                <button aria-pressed={selectedKey === key} onClick={() => onSelect("career", career.id)} type="button">
                  <strong>{career.label}</strong>
                  <small>{career.description}</small>
                  <i aria-hidden="true">→</i>
                </button>
              </li>
            );
          }) : null}
        </ul>
      </section>
    </div>
  );
}

function ProcessTags({ processIds }: { processIds: IndustryMapProcessId[] }) {
  return (
    <div className="industry-explorer__process-tags">
      {processIds.map((processId) => {
        const process = industryMapProcesses.find((item) => item.id === processId);
        return process ? <span key={process.id}>{process.label}</span> : null;
      })}
    </div>
  );
}
