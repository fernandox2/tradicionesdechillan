import {
  IoStorefrontOutline,
  IoLocationSharp,
  IoCallOutline,
  IoMailOutline,
  IoMapOutline,
} from "react-icons/io5";

interface Props {
  branches: {
    name: string;
    id: string;
    address: string;
    phone: string;
    email: string;
    lat: number;
    lng: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
  }[];
  onViewMap?: (branch: any) => void;
}

export const LocalesCards = ({ branches, onViewMap }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-4 p-7 overflow-hidden transition-all duration-300 group hover:shadow-blue-200 hover:border-blue-600 hover:scale-105"
        >
          {/* Icon fondo decorativo */}
          <IoStorefrontOutline className="absolute right-5 top-4 text-blue-50 group-hover:text-blue-100 w-20 h-20 z-0 rotate-12 transition-all duration-300" />
          {/* Nombre */}
          <h3 className="text-2xl font-extrabold text-blue-800 flex items-center gap-3 z-10 relative">
            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded-full w-12 h-12 shadow-sm border-2 border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <IoStorefrontOutline className="w-7 h-7 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
            </span>
            {branch.name}
          </h3>
          {/* Dirección */}
          <div className="flex items-center gap-3 text-gray-600 font-medium text-base z-10">
            <span className="bg-blue-50 text-blue-600 rounded-full p-2">
              <IoLocationSharp className="w-6 h-6" />
            </span>
            <span className="truncate">{branch.address}</span>
          </div>
          {/* Teléfono */}
          <div className="flex items-center gap-3 text-gray-600 font-medium text-base z-10">
            <span className="bg-green-50 text-green-600 rounded-full p-2">
              <IoCallOutline className="w-6 h-6" />
            </span>
            <a
              href={`tel:${branch.phone}`}
              className="hover:underline transition text-green-700"
            >
              {branch.phone}
            </a>
          </div>
          {/* Email */}
          <div className="flex items-center gap-3 text-gray-600 font-medium text-base z-10">
            <span className="bg-pink-50 text-pink-600 rounded-full p-2">
              <IoMailOutline className="w-6 h-6" />
            </span>
            <a
              href={`mailto:${branch.email}`}
              className="hover:underline transition text-pink-700"
            >
              {branch.email}
            </a>
          </div>
          {/* Acción "Ver en mapa" */}
          {onViewMap && (
            <button
              onClick={() => onViewMap(branch)}
              className="mt-2 flex items-center gap-2 bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white hover:shadow-blue-200 transition-all duration-200 z-10"
            >
              <IoMapOutline className="w-5 h-5" />
              Ver en mapa
            </button>
          )}
          {/* Efecto animado decorativo */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-80 transition pointer-events-none z-0 bg-gradient-to-tr from-blue-50 via-white to-blue-100"></div>
        </div>
      ))}
    </div>
  );
};
