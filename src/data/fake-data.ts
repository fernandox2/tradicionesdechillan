import { Branch } from "@/interfaces";

export const locales: Branch[] = [
  {
    name: "Mercado de Chillán, Local 42",
    lat: -36.610295929548656,
    lng: -72.10119943187311,
    image: "/imgs/icono-tradiciones.webp",
    address: "Mercado de Chillán, Local 42",
    phone: "+52 222 123 4567",
    schedule: "Lunes a Domingo 10:00 - 20:00",
    website: "https://example.com/local1",
  },
  {
    name: "Supermercado Santa Isabel",
    lat: -36.62481454311182,
    lng: -72.07856425958188,
    image: "/imgs/icono-tradiciones.webp",
    address: "Av Alonso de Ercilla 2780, 3811664 Chillán, Ñuble",
    phone: "+52 222 123 4567",
    schedule: "Lunes a Domingo 10:00 - 20:00",
    website: "https://example.com/local1",
  },
  {
    name: "Supermercado Jumbo",
    lat: -36.59505082022049,
    lng: -72.10676108840795,
    image: "/imgs/icono-tradiciones.webp",
    address: "Longitudinal Sur 134, Chillán, Ñuble",
    phone: "+52 222 123 4567",
    schedule: "Lunes a Domingo 10:00 - 20:00",
    website: "https://example.com/local1",
  },
];


export const getFakeLocales = async () => {
  return new Promise<Branch[]>((resolve) => {
    setTimeout(() => {
      resolve(locales);
    }, 1000);
  });
}


