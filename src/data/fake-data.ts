import { Branch } from "@/interfaces";

export const locales: Branch[] = [
  {
    id: "1",
    name: "Mercado de Chillán, Local 42",
    lat: -36.610295929548656,
    lng: -72.10119943187311,
    image: "/imgs/icono-tradiciones.webp",
    address: "Mercado de Chillán, Local 42",
    phone: "+56 935 683 255",
    schedule: "Lunes a Domingo 10:00 - 20:00",
    website: "https://example.com/local1",
    email: "contacto@mercadochillan.cl",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getFakeLocales = async () => {
  return new Promise<Branch[]>((resolve) => {
    setTimeout(() => {
      resolve(locales);
    }, 1000);
  });
};
