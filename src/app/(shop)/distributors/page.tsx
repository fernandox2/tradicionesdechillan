import { getAllBranches } from "@/actions/branch/branch-pagination";
import { nickainley, sequel } from "@/config/fonts";
import dynamic from "next/dynamic";
import { LocalesCards } from "./ui/Branches";


const LeafletMap = dynamic(() => import("./ui/LeafletMap"), { ssr: false });

export default async function BranchPage() {

  const branches = await getAllBranches();

  if (!branches || branches.length === 0) {
    return <div className="text-center text-red-500">No se encontraron sucursales.</div>;
  }

  const processBranches = branches.map(branch => ({
    id: branch.id,
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    email: branch.email,
    lat: branch.lat,
    lng: branch.lng,
  }));



  return (
    <div className="flex flex-col gap-1 min-h-screen w-full max-w-7xl mx-auto px-4 bg-gray-100 py-10">
        <div className="flex flex-col items-start justify-start gap-0 mb-8 px-10 max-w-lg">
            <h2 className={`${sequel.className} text-4xl max-w-4xl text-orange-650 leading-tight`}>Encuentranos</h2>
            <h3 className={`${nickainley.className} text-2xl max-w-4xl text-gray-900 leading-tight`}>en los mejores lugares de Chile</h3>
        </div>
        <LeafletMap branches={processBranches} />
        <div className="flex flex-col items-start justify-start gap-4 px-10 max-w-7xl mt-10">
          <LocalesCards branches={branches} />
        </div>
    </div>
  );
}