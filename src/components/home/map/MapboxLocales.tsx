"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { avenir_medium } from "@/config/fonts";

// Interfaz Branch (asegúrate de que lat y lng estén en orden correcto).
export interface Branch {
  name: string;
  lat: number;
  lng: number;
  image: string;
  address?: string;
  phone?: string;
  schedule?: string;
  website?: string;
}

interface MapboxLocalesProps {
  mapboxToken: string;
  locales: Branch[];
}

const MapboxLocales: React.FC<MapboxLocalesProps> = ({ mapboxToken, locales }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // 1) Asignar el token de Mapbox:
    mapboxgl.accessToken = mapboxToken;

    // 2) Determinar coordenadas para centrar el mapa:
    //    Asegúrate de que lng sea el primer valor y lat el segundo.
    const centerCoordinates: [number, number] = locales.length
      ? [locales[0].lng, locales[0].lat]
      : [-72.10119943187311, -36.610295929548656]; // Ejemplo por defecto.

    // 3) Crear el mapa:
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      style: "mapbox://styles/mapbox/light-v11",
      center: centerCoordinates,
      zoom: 12,
    });
    mapRef.current = map;

    // 4) Agregar controles de navegación (zoom y rotación).
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // 5) Crear marcadores para cada local.
    locales.forEach((branch) => {
      // Asegúrate de NO invertir el orden [lng, lat]:
      const markerCoordinates: [number, number] = [branch.lng, branch.lat];

      // Contenedor principal que agrupa ícono y texto con flex-column.
      const markerContainer = document.createElement("div");
      markerContainer.style.display = "flex";
      markerContainer.style.flexDirection = "column";
      markerContainer.style.alignItems = "center";

      // Ícono circular de 50x50 con tu imagen.
      const iconEl = document.createElement("div");
      iconEl.style.width = "32px";
      iconEl.style.height = "32px";
      iconEl.style.borderRadius = "50%";
      iconEl.style.cursor = "pointer";
      iconEl.style.backgroundImage = "url('/imgs/icono-tradiciones.webp')";
      iconEl.style.backgroundSize = "cover";
      iconEl.style.backgroundRepeat = "no-repeat";
      iconEl.style.backgroundPosition = "center";

      // Texto (nombre del local) debajo del ícono.
      const nameEl = document.createElement("div");
      nameEl.textContent = branch.name;
      nameEl.style.marginTop = "4px"; // Separación del ícono
      nameEl.style.background = "#fff";
      nameEl.style.padding = "2px 6px";
      nameEl.style.fontSize = "14px";
      nameEl.style.fontWeight = "bold";
      nameEl.style.color = "#333";
      nameEl.style.borderRadius = "4px";
      nameEl.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";

      // Los añadimos al contenedor principal.
      markerContainer.appendChild(iconEl);
      markerContainer.appendChild(nameEl);

      // Popup con más información (al hacer clic en el marcador).
      const popupHtml = `
        <div class="${avenir_medium.className}" style="max-width: 250px; text-align: center; padding: 10px;">
          <Image src="${branch.image}" alt="${branch.name}" style="display: block; margin: 0 auto 8px; width: 100px; height: auto;" />
          <h3 style="margin: 8px 0 4px; font-size: 18px; color: #333;">${branch.name}</h3>
          <p style="margin: 4px 0; font-size: 14px; color: #555;">${branch.address || ""}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #555;">${branch.phone || ""}</p>
          ${
        branch.website
          ? `<a href="${branch.website}" target="_blank" style="display: inline-block; margin-top: 8px; font-size: 14px; color: #1E90FF; text-decoration: underline;">Más información</a>`
          : ""
          }
        </div>
      `;
      const popup = new mapboxgl.Popup({ offset: 25, anchor: "top" }).setHTML(popupHtml);

      // 6) Crear y añadir el Marker, con anclaje en la parte inferior (bottom).
      new mapboxgl.Marker({
        element: markerContainer,
        anchor: "bottom", // importante para que se ancle bien
      })
        .setLngLat(markerCoordinates)
        .setPopup(popup)
        .addTo(map);
    });

    // 7) Limpieza: al desmontar el componente, remover el mapa.
    return () => {
      map.remove();
    };
  }, [mapboxToken, locales]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "416px",
        overflow: "hidden",
      }}
    />
  );
};

export default MapboxLocales;
