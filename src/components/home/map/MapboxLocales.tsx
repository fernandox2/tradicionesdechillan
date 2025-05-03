"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    mapboxgl: any;
  }
}

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

interface Props {
  mapboxToken: string;
  locales: Branch[];
}

function loadMapboxCss(callback: () => void): void {
  const cssUrl = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css";
  if (!document.head.querySelector(`link[href="${cssUrl}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl;
    link.onload = callback;
    link.onerror = () => {
      console.error("Error loading Mapbox CSS");
      callback();
    };
    document.head.appendChild(link);
  } else {
    callback();
  }
}

export default function MapboxLocales({ mapboxToken, locales }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isCssLoaded, setIsCssLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isMapboxReady, setIsMapboxReady] = useState(false);

  useEffect(() => {
    loadMapboxCss(() => {
      setIsCssLoaded(true);
    });
  }, []);

  useEffect(() => {
    const scriptId = "mapbox-gl-js-script-tag";
    const scriptUrl = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js";

    if (document.getElementById(scriptId) || window.mapboxgl) {
      if (window.mapboxgl) setIsMapboxReady(true);
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = scriptUrl;
    script.async = true;

    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = (error) => {
      console.error("Failed to load Mapbox JS script:", error);
    };

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      if (window.mapboxgl) {
        setIsMapboxReady(true);
      } else {
        const timer = setTimeout(() => {
          if (window.mapboxgl) {
            setIsMapboxReady(true);
          } else {
            console.error("window.mapboxgl still not available after delay.");
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
    return undefined; // Add explicit return undefined for clarity
  }, [isScriptLoaded]);

  useEffect(() => {
    if (!isCssLoaded || !isMapboxReady || !ref.current) {
      return;
    }

    const container = ref.current;
    let map: any;

    try {
      window.mapboxgl.accessToken = mapboxToken;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      map = new window.mapboxgl.Map({
        container: container,
        style: "mapbox://styles/mapbox/light-v11",
        center: locales.length
          ? [locales[0].lng, locales[0].lat]
          : [-72.10119943187311, -36.610295929548656],
        zoom: 12,
      });
      mapInstanceRef.current = map;

      map.on("load", () => {}); // Empty listener, add logic if needed
      map.on("error", (e: any) => {
        console.error("Mapbox Map error event:", e);
      });

      map.addControl(new window.mapboxgl.NavigationControl(), "top-right");

      locales.forEach((b) => {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = "center";

        const icon = document.createElement("div");
        icon.style.width = "32px";
        icon.style.height = "32px";
        icon.style.borderRadius = "50%";
        icon.style.background =
          "url('/imgs/icono-tradiciones.webp') center/cover no-repeat";
        wrapper.appendChild(icon);

        const label = document.createElement("div");
        label.innerText = b.name;
        label.style.marginTop = "4px";
        label.style.background = "#fff";
        label.style.padding = "2px 6px";
        label.style.fontSize = "14px";
        label.style.fontWeight = "700";
        label.style.color = "#333";
        label.style.borderRadius = "4px";
        label.style.boxShadow = "0 1px 3px rgba(0,0,0,.3)";
        wrapper.appendChild(label);

        const popup = new window.mapboxgl.Popup({
          offset: 25,
          anchor: "top",
        }).setHTML(
          `<div style="max-width:250px;text-align:center;padding:10px;">` +
            `<img src="${b.image}" alt="${b.name}" style="display:block;margin:0 auto 8px;width:100px;height:auto;" />` +
            `<h3 style="margin:8px 0 4px;font-size:18px;color:#333;">${b.name}</h3>` +
            `<p style="margin:4px 0;font-size:14px;color:#555;">${b.address ?? ""}</p>` +
            `<p style="margin:4px 0;font-size:14px;color:#555;">${b.phone ?? ""}</p>` +
            `${
              b.website
                ? `<a href="${b.website}" target="_blank" style="display:inline-block;margin-top:8px;font-size:14px;color:#1E90FF;text-decoration:underline;">Más información</a>`
                : ""
            }` +
            `</div>`
        );

        new window.mapboxgl.Marker({ element: wrapper, anchor: "bottom" })
          .setLngLat([b.lng, b.lat])
          .setPopup(popup)
          .addTo(map);
      });
    } catch (error) {
      console.error("Error during map initialization:", error);
    }

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [isCssLoaded, isMapboxReady, mapboxToken, locales]);

  return <div ref={ref} className="w-full h-[416px]" />;
}