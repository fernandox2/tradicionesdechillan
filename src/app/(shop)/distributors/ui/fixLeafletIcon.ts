// Ejecuta esto sólo en cliente
if (typeof window !== "undefined") {
  // Solo requiere si es cliente, si no ya está
  const L = require("leaflet");
  // Parches para que Leaflet encuentre los iconos cuando se usen markers por defecto
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/images/marker-shadow.png",
  });
}
