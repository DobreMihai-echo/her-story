"use client";

import { useEffect, useState } from "react";

export default function SubmitMapClient({
  onPick,
  selected,
}: {
  onPick: (lat: number, lng: number) => void;
  selected: { lat: number; lng: number } | null;
}) {
  const [leaf, setLeaf] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const L = await import("leaflet");
      const RL = await import("react-leaflet");

      const markerIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      if (mounted) setLeaf({ L, RL, markerIcon });
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!leaf) {
    return (
      <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--line)" }}>
        <div className="badge">DROP A PIN</div>
        <div className="mt-3 text-[color:var(--muted)]">Loading map…</div>
      </div>
    );
  }

  const { RL, markerIcon } = leaf;
  const { MapContainer, TileLayer, Marker, useMapEvents } = RL;

  function ClickToPin() {
    useMapEvents({
      click(e: any) {
        onPick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--line)" }}>
      <div style={{ width: "100%", height: 420 }}>
        <MapContainer center={[20, 0]} zoom={2} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPin />
          {selected && (
            <Marker position={[selected.lat, selected.lng]} icon={markerIcon} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
