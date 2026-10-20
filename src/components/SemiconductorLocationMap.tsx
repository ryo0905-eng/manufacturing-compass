"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./SemiconductorLocationExplorer.module.css";

export type LocationMapPoint = {
  id: string; name: string; latitude: number; longitude: number;
  status: string; label: string;
};
type Props = { points: LocationMapPoint[]; selectedId?: string; onSelect: (id: string) => void };
const japanBounds: Leaflet.LatLngBoundsExpression = [[24, 122], [46, 146]];

export default function SemiconductorLocationMap({ points, selectedId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const leaflet = useRef<typeof Leaflet | null>(null);
  const layer = useRef<Leaflet.LayerGroup | null>(null);
  const markersById = useRef(new Map<string, Leaflet.Marker>());
  const lastPointIds = useRef("");
  const select = useRef(onSelect);
  const lastSelection = useRef<string | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { select.current = onSelect; }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    import("leaflet").then(L => {
      if (cancelled || !container.current) return;
      leaflet.current = L;
      const instance = L.map(container.current, { minZoom: 4, maxZoom: 18, scrollWheelZoom: false });
      map.current = instance;
      instance.fitBounds(japanBounds, { padding: [12, 12] });
      L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル</a> | Shoreline: NGA, VMAP0 (1997)',
      }).on("tileerror", () => {
        if (!cancelled) setError("背景地図の一部を取得できません。拠点一覧からも探索できます。");
      }).addTo(instance);
      L.control.scale({ imperial: false }).addTo(instance);
      layer.current = L.layerGroup().addTo(instance);
      observer = new ResizeObserver(() => instance.invalidateSize({ pan: false }));
      observer.observe(container.current);
      setReady(true);
    }).catch(() => { if (!cancelled) setError("地図を読み込めませんでした。拠点一覧をご利用ください。"); });
    return () => {
      cancelled = true;
      observer?.disconnect();
      map.current?.remove();
      map.current = null;
      layer.current = null;
      markersById.current.clear();
      lastPointIds.current = "";
    };
  }, []);

  useEffect(() => {
    const L = leaflet.current, instance = map.current, markers = layer.current;
    if (!ready || !L || !instance || !markers) return;
    const visibleIds = new Set(points.map(point => point.id));
    for (const [id, marker] of markersById.current) {
      if (!visibleIds.has(id)) { markers.removeLayer(marker); markersById.current.delete(id); }
    }
    const pointIds = points.map(point => point.id).sort().join(",");
    if (lastPointIds.current && pointIds !== lastPointIds.current && points.length && !selectedId) {
      instance.fitBounds(points.map(point => [point.latitude, point.longitude] as Leaflet.LatLngTuple), { padding: [40, 40], maxZoom: 10 });
    }
    lastPointIds.current = pointIds;
    for (const point of points) {
      const selected = point.id === selectedId;
      let marker = markersById.current.get(point.id);
      if (!marker) {
        marker = L.marker([point.latitude, point.longitude], {
        icon: L.divIcon({
          className: `${styles.pin} ${styles[point.status] ?? styles.operating} ${selected ? styles.selectedPin : ""}`,
          html: '<span aria-hidden="true"></span>', iconSize: [22, 28], iconAnchor: [11, 28],
        }),
        title: `${point.name}：${point.label}`, alt: `${point.name}の詳細を開く`, keyboard: true,
        zIndexOffset: selected ? 1000 : 0,
        });
        marker.on("click", () => select.current(point.id));
        marker.addTo(markers);
        markersById.current.set(point.id, marker);
      }
      const element = marker.getElement();
      for (const status of ["operating", "construction", "pilot", "planned", "unconfirmed"]) {
        element?.classList.toggle(styles[status], point.status === status);
      }
      element?.classList.toggle(styles.selectedPin, selected);
      element?.setAttribute("title", `${point.name}：${point.label}`);
      element?.setAttribute("aria-pressed", String(selected));
      marker.setZIndexOffset(selected ? 1000 : 0);
      const label = document.createElement("span");
      label.textContent = `${point.name} · ${point.label}`;
      if (marker.getTooltip()) marker.setTooltipContent(label);
      else marker.bindTooltip(label, { direction: "top", offset: [0, -25] });
      if (selected && selectedId !== lastSelection.current) {
        instance.setView([point.latitude, point.longitude], Math.max(instance.getZoom(), 10), { animate: false });
      }
    }
    lastSelection.current = selectedId;
  }, [points, selectedId, ready]);

  return <div className={styles.mapFrame}>
    <div ref={container} className={styles.mapCanvas} role="region" aria-label="日本の半導体拠点地図" />
    {!ready && !error && <p className={styles.mapMessage} role="status">地図を読み込んでいます…</p>}
    {error && <p className={styles.mapError} role="status">{error}</p>}
    <button className={styles.resetMap} type="button" disabled={!ready} onClick={() => {
      map.current?.fitBounds(japanBounds, { padding: [12, 12] });
    }}>全国を表示</button>
    <div className={styles.legend} aria-label="ピンの凡例">
      <span><i className={styles.operating} />稼働中</span>
      <span><i className={styles.construction} />建設・増設中</span>
      <span><i className={styles.pilot} />試作ライン稼働</span>
      <span><i className={styles.planned} />計画中</span>
      <span><i className={styles.unconfirmed} />状態確認中</span>
    </div>
  </div>;
}
