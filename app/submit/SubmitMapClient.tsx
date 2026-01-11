"use client";

import { useEffect, useState } from "react";

type PlacePick = { name: string; lat: number; lng: number };

export default function SubmitMapPanelClient({
  placeLat,
  placeLng,
  placeName,
  onPickPin,
  onSetPlaceName,
  placeQuery,
  onPlaceSearchChange,
  placeOptions,
  onChoosePlace,
}: {
  placeLat: number | null;
  placeLng: number | null;
  placeName: string;
  onPickPin: (lat: number, lng: number) => void;
  onSetPlaceName: (name: string) => void;

  placeQuery: string;
  onPlaceSearchChange: (v: string) => void;
  placeOptions: PlacePick[];
  onChoosePlace: (p: PlacePick) => void;
}) {
  const [leaf, setLeaf] = useState<{
    L: any;
    RL: any;
    markerIcon: any;
  } | null>(null);

  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setMapError(null);

        const Lmod: any = await import("leaflet");
        const RLmod: any = await import("react-leaflet");

        // In some bundlers, exports can be nested; normalize:
        const L = Lmod?.default ?? Lmod;
        const RL = RLmod?.default ?? RLmod;

        if (!RL?.MapContainer || !RL?.TileLayer || !RL?.Marker || !RL?.useMapEvents || !RL?.useMap) {
          throw new Error("react-leaflet exports not found (MapContainer/TileLayer/Marker/useMapEvents/useMap).");
        }

        const markerIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:14px;height:14px;border-radius:999px;
            background:#ff2d8d;
            box-shadow:0 10px 24px rgba(255,45,141,.35);
            border:2px solid rgba(255,255,255,.95);
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        if (mounted) setLeaf({ L, RL, markerIcon });
      } catch (e: any) {
        console.error("Map load error:", e);
        if (mounted) setMapError(e?.message ?? "Unknown map error");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (mapError) {
    return (
      <div className="card p-6">
        <div className="badge">MAP ERROR</div>
        <div className="mt-3 text-red-600 text-sm">{mapError}</div>
        <div className="mt-2 text-[color:var(--muted)] text-xs">
          Check browser console for details.
        </div>
      </div>
    );
  }

  if (!leaf) {
    return (
      <div className="card p-6">
        <div className="badge">DROP A PIN</div>
        <div className="mt-3 text-[color:var(--muted)] text-sm">Loading map…</div>
        <div className="mt-4 rounded-2xl border bg-white/70" style={{ borderColor: "var(--line)", height: 420 }} />
      </div>
    );
  }

  const { RL, markerIcon } = leaf;
  const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = RL;

  function ClickToPin() {
    useMapEvents({
      click(e: any) {
        onPickPin(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  function FixSizeOnce() {
    const map = useMap();
    useEffect(() => {
      const t = setTimeout(() => map.invalidateSize(), 250);
      return () => clearTimeout(t);
    }, [map]);
    return null;
  }

  return (
    <div className="card p-6">
      <div className="badge">DROP A PIN</div>
      <p className="mt-3 text-[color:var(--muted)] text-sm">
        Click anywhere on the map. We’ll save the exact location.
      </p>

      <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor: "var(--line)" }}>
        <div style={{ width: "100%", height: 420 }}>
          <MapContainer center={[20, 0]} zoom={2} style={{ width: "100%", height: "100%" }}>
            <FixSizeOnce />
            <TileLayer
              attribution='&copy; OpenStreetMap contributors &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <ClickToPin />
            {placeLat !== null && placeLng !== null && (
              <Marker position={[placeLat, placeLng]} icon={markerIcon} />
            )}
          </MapContainer>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-[color:var(--muted)]">Selected place</div>
        <div className="mt-1" style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>
          {placeName || "No pin yet"}
        </div>
        {placeLat !== null && placeLng !== null && (
          <div className="text-xs text-[color:var(--muted)] mt-1">
            {placeLat.toFixed(4)}, {placeLng.toFixed(4)}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="text-sm text-[color:var(--muted)]">Or search (optional)</div>
        <input
          className="mt-2 w-full rounded-xl border px-3 py-2 bg-white"
          style={{ borderColor: "var(--line)" }}
          value={placeQuery}
          onChange={(e) => onPlaceSearchChange(e.target.value)}
          placeholder="Search a place name…"
        />
        {placeOptions.length > 0 && (
          <div className="mt-2 rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
            {placeOptions.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChoosePlace(p);
                  onSetPlaceName(p.name);
                }}
                className="w-full text-left px-3 py-2 hover:bg-pink-50"
              >
                <div className="text-sm">{p.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
