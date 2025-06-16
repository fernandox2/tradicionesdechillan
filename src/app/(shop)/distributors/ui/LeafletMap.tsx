"use client";
import "./fixLeafletIcon";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });
import { useMap } from "react-leaflet";

const branchIcon = L.icon({
  iconUrl: "/imgs/icono-tradiciones.webp",
  iconSize: [32, 32],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function LeafletMap({ branches = [] }: { branches?: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [query, setQuery] = useState("");
  const mapRef = useRef<any>(null);
  const flyToInitial = useRef(false);

  const defaultCenter = useMemo<[number, number]>(
    () => userPos ?? (branches.length > 0 ? [branches[0].lat, branches[0].lng] : [-33.45, -70.66]),
    [userPos, branches]
  );
  const defaultZoom = 9;
  const initialView = useRef<{ center: [number, number]; zoom: number }>({ center: defaultCenter, zoom: defaultZoom });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    navigator.geolocation?.getCurrentPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () =>
        fetch("https://ipapi.co/json/")
          .then((r) => r.json())
          .then((d) =>
            d?.latitude && d?.longitude
              ? setUserPos([d.latitude, d.longitude])
              : void 0
          ),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [mounted]);

  const filtered = useMemo(
    () =>
      branches.filter(
        (b) =>
          b.name &&
          b.name.toLowerCase().includes(query.toLowerCase())
      ),
    [branches, query]
  );

  function MapRefSetter() {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map;
      setMapReady(true);
      initialView.current = { center: [map.getCenter().lat, map.getCenter().lng], zoom: map.getZoom() };
    }, [map]);
    return null;
  }

  useEffect(() => {
    if (!mapReady || !userPos || flyToInitial.current) return;
    flyToInitial.current = true;
    mapRef.current?.flyTo(userPos, defaultZoom, { duration: 1.5 });
  }, [userPos, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (filtered.length === 1) {
      const b = filtered[0];
      if (b.lat && b.lng) {
        mapRef.current.flyTo([b.lat, b.lng], 13, { duration: 1.5 });
      }
    }
  }, [filtered, mapReady]);

  const handleViewAll = () => {
    setQuery("");
    if (mapRef.current && initialView.current) {
      mapRef.current.flyTo(initialView.current.center, initialView.current.zoom, { duration: 1.5 });
    }
  };

  const showViewAll = query.length > 0 || (filtered.length === 1 && branches.length > 1);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4 w-full px-10">
      <div className="flex gap-2 items-center">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Buscar sucursal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {showViewAll && (
          <button
            onClick={handleViewAll}
            className="ml-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Ver todas las sucursales
          </button>
        )}
      </div>
      <div className="h-[500px] w-full">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <MapRefSetter />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userPos && (
            <Marker position={userPos}>
              <Popup>Tu ubicación</Popup>
            </Marker>
          )}
          {filtered.map((b) =>
            b.lat && b.lng ? (
              <Marker key={b.id} position={[b.lat, b.lng]} icon={branchIcon}>
                <Popup>
                  <strong>{b.name}</strong>
                  <br />
                  {b.address}
                  <br />
                  {b.phone}
                  <br />
                  {b.email}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
}
