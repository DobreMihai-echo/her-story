"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Pin = {
  id: string;
  message: string;
  author: string;
  placeName: string | null;
  lat: number;
  lng: number;
  photo: string | null;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function CityPage() {
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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mt-8 card overflow-hidden">
  <div
    className="p-10 text-white"
    style={{
      backgroundImage:
        "linear-gradient(180deg, rgba(255,45,141,.12) 0%, rgba(20,10,18,.55) 75%), url(/satc/city.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: 220,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }}
  >

    <div className="mt-4 text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
      Places that remember her.
    </div>
  </div>
</section>  
      <div className="badge">THE CITY</div>
      <h1 className="mt-4 text-5xl" style={{ fontFamily: "var(--font-heading)" }}>The world, marked by her.</h1>
      <p className="mt-3 text-[color:var(--muted)] text-lg">Every pin is a place someone remembers her.</p>

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
                      <div className="font-bold" style={{ color: "var(--pink)" }}>{p.placeName ?? "A place"}</div>
                      <div className="mt-2" style={{ color: "rgba(20,10,18,.70)" }}>“{p.message}”</div>
                      <div className="mt-2 text-sm" style={{ color: "rgba(20,10,18,.60)" }}>— {p.author}</div>
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
              <div className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>{selected.placeName ?? "Somewhere unforgettable"}</div>
              {selected.photo && (
                <img src={selected.photo} alt="" className="w-full h-44 object-cover rounded-2xl border" style={{ borderColor: "var(--line)" }} />
              )}
              <div className="text-[color:var(--muted)] leading-relaxed">“{selected.message}”</div>
              <div className="text-sm text-[color:var(--muted)]">— {selected.author}</div>
            </div>
          ) : (
            <p className="mt-5 text-[color:var(--muted)]">Click a pin to open a memory.</p>
          )}
        </aside>
      </div>
    </main>
  );
}
