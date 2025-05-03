"use client";

import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

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

export default function MapboxLocales({ mapboxToken, locales }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;

    (async () => {
      const { default: mbx } = await import("mapbox-gl");
      mbx.accessToken = mapboxToken;

      map = new mbx.Map({
        container: ref.current as HTMLElement,
        style: "mapbox://styles/mapbox/light-v11",
        center: locales.length
          ? [locales[0].lng, locales[0].lat]
          : [-72.10119943187311, -36.610295929548656],
        zoom: 12,
      });

      map.addControl(new mbx.NavigationControl(), "top-right");

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

        const popup = new mbx.Popup({ offset: 25, anchor: "top" }).setHTML(`
          <div style="max-width:250px;text-align:center;padding:10px;">
            <img src="${b.image}" alt="${b.name}" style="display:block;margin:0 auto 8px;width:100px;height:auto;" />
            <h3 style="margin:8px 0 4px;font-size:18px;color:#333;">${b.name}</h3>
            <p style="margin:4px 0;font-size:14px;color:#555;">${b.address ?? ""}</p>
            <p style="margin:4px 0;font-size:14px;color:#555;">${b.phone ?? ""}</p>
            ${
              b.website
                ? `<a href="${b.website}" target="_blank" style="display:inline-block;margin-top:8px;font-size:14px;color:#1E90FF;text-decoration:underline;">Más información</a>`
                : ""
            }
          </div>
        `);

        new mbx.Marker({ element: wrapper, anchor: "bottom" })
          .setLngLat([b.lng, b.lat])
          .setPopup(popup)
          .addTo(map);
      });
    })();

    return () => map?.remove();
  }, [mapboxToken, locales]);

  return <div ref={ref} className="w-full h-[416px]" />;
}
