// components/MapboxScripts.tsx
"use client";
import Script from "next/script";

export function MapboxScripts() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
      />
      <Script
        src="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
        strategy="lazyOnload"
      />
    </>
  );
}
