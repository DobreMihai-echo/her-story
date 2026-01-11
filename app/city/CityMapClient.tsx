"use client";

import { useEffect, useMemo, useState } from "react";

type Pin = {
  id: string;
  message: string;
  author: string;
  placeName: string | null;
  lat: number;
  lng: number;
  photo: string | null;
};

export default function CityMapClient() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selected, setSelected] = useState<Pin | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/city");
      const d = await r.json();
      if (d.ok) setPins(d.memories);
    })();
  }, []);

  const center = useMemo<[number, number]>(() => {
    if (!pins.length) return [20, 0];
    return [pins[0].lat, pins[0].lng];
  }, [pins]);

  // Import Leaflet/react-leaflet only in the browser
  const [Leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
const L = await import("leaflet");
const RL = await import("react-leaflet");

      // Fix marker icons (CDN)
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

      if (mounted) setLeaflet({ L, RL, markerIcon });
    })();
    return () => { mounted = false; };
  }, []);

  if (!Leaflet) {
    return (
      <div className="card p-8">
        <div className="badge">THE CITY</div>
        <div className="mt-4 text-[color:var(--muted)]">Loading map…</div>
      </div>
    );
  }

  const { RL, markerIcon } = Leaflet;
  const { MapContainer, TileLayer, Marker, Popup } = RL;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8 card overflow-hidden">
        <div style={{ width: "100%", height: 560 }}>
          <MapContainer center={center} zoom={pins.length ? 3 : 2} style={{ width: "100%", height: "100%" }}>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {pins.map((p) => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={markerIcon}
                eventHandlers={{ click: () => setSelected(p) }}
              >
                <Popup>
                  <div style={{ minWidth: 220 }}>
                    <div className="font-bold" style={{ color: "var(--pink)" }}>
                      {p.placeName ?? "A place"}
                    </div>
                    <div className="mt-2" style={{ color: "rgba(20,10,18,.70)" }}>
                      “{p.message}”
                    </div>
                    <div className="mt-2 text-sm" style={{ color: "rgba(20,10,18,.60)" }}>
                      — {p.author}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <aside className="lg:col-span-4 card p-7">
        <div className="badge">PIN DETAILS</div>

        {selected ? (
          <div className="mt-5 space-y-4">
            <div className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
              {selected.placeName ?? "Somewhere unforgettable"}
            </div>

            {selected.photo && (
              <img
                src={selected.photo}
                alt=""
                className="w-full h-44 object-cover rounded-2xl border"
                style={{ borderColor: "var(--line)" }}
              />
            )}

            <div className="text-[color:var(--muted)] leading-relaxed">
              “{selected.message}”
            </div>

            <div className="text-sm text-[color:var(--muted)]">— {selected.author}</div>
          </div>
        ) : (
          <p className="mt-5 text-[color:var(--muted)]">Click a pin to open a memory.</p>
        )}
      </aside>
    </div>
  );
}
