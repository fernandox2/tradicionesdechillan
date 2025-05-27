
'use client';

import Link from 'next/link';
import { IoPencil, IoLocationOutline, IoBusinessOutline, IoTrashOutline } from 'react-icons/io5';
import type { Branch as PrismaBranch, User as PrismaUser } from '@prisma/client';
import { deleteBranchAction } from '@/actions/branch/delete-branch';
import { Mensaje } from '@/components/ui/toast/Toast';
import { useRouter } from 'next/navigation';

export interface BranchForTable extends PrismaBranch {
  user?: Pick<PrismaUser, 'id' | 'name' | 'email'> | null;
}

interface IBranchesTableProps {
  branches: BranchForTable[];
}

export const BranchesTable = ({ branches }: IBranchesTableProps) => {
    const router = useRouter();

    const handleDeleteBranch = async (branchId: string, branchName: string) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar la sucursal "${branchName}"? Esta acción no se puede deshacer.`)) {
          return;
        }
    
        try {
          const result = await deleteBranchAction(branchId);
          if (result.ok) {
            Mensaje(result.message || 'Sucursal eliminada exitosamente.', 'success', { title: 'Eliminada' });
            router.refresh(); 
          } else {
            Mensaje(result.error || 'No se pudo eliminar la sucursal.', 'error', { title: 'Error al Eliminar' });
          }
        } catch (error) {
          console.error("Error al llamar a deleteBranchAction:", error);
          Mensaje('Ocurrió un error de red o inesperado.', 'error', { title: 'Error Crítico' });
        }
      };

      
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-slate-700">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-300">
            <tr>
              <th scope="col" className="w-16 px-4 py-3 md:px-6 text-center">
                <IoBusinessOutline size={18} className="inline-block" />
              </th>
              <th scope="col" className="min-w-[180px] px-4 py-3 md:px-6">
                Nombre Sucursal
              </th>
              <th scope="col" className="min-w-[200px] px-4 py-3 md:px-6 max-w-md truncate">
                Dirección
              </th>
              <th scope="col" className="min-w-[120px] px-4 py-3 md:px-6">
                Teléfono
              </th>
              <th scope="col" className="min-w-[180px] px-4 py-3 md:px-6 max-w-sm truncate">
                Email
              </th>
              <th scope="col" className="min-w-[150px] px-4 py-3 md:px-6 hidden lg:table-cell">
                Coordenadas
              </th>
              <th scope="col" className="min-w-[150px] px-4 py-3 md:px-6 hidden md:table-cell max-w-xs truncate">
                Usuario Asignado
              </th>
              <th
                scope="col"
                className="w-28 px-4 py-3 md:px-6 bg-slate-50 sticky right-0 z-10"
                style={{ boxShadow: "-2px 0 5px -2px rgba(0,0,0,0.1)" }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr
                key={branch.id}
                className="bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-4 py-3 md:px-6 w-16 text-center text-slate-500">
                  <IoLocationOutline size={20} className="inline-block" />
                </td>
                <td className="px-4 py-3 md:px-6 font-medium text-slate-900 min-w-[180px] max-w-xs truncate">
                  {branch.name}
                  <p className="text-xs text-slate-500 uppercase truncate">
                    ID: {branch.id.split("-")[0]}...
                  </p>
                </td>
                <td className="px-4 py-3 md:px-6 min-w-[200px] max-w-md truncate" title={branch.address}>
                  {branch.address}
                </td>
                <td className="px-4 py-3 md:px-6 min-w-[120px]">
                  {branch.phone}
                </td>
                <td className="px-4 py-3 md:px-6 min-w-[180px] max-w-sm truncate" title={branch.email}>
                  {branch.email}
                </td>
                <td className="px-4 py-3 md:px-6 min-w-[150px] hidden lg:table-cell">
                  {branch.lat !== null && branch.lng !== null ? `Lat: ${branch.lat.toFixed(4)}, Lng: ${branch.lng.toFixed(4)}` : 'N/A'}
                </td>
                <td className="px-4 py-3 md:px-6 min-w-[150px] hidden md:table-cell max-w-xs truncate" title={branch.user?.email || branch.userId || ''}>
                  {branch.user?.name || branch.user?.email || branch.userId || "No asignado"}
                </td>

                
                <td
                  className="px-4 py-3 md:px-6 w-30 bg-gray-100 sticky right-0 z-10 space-x-2 flex items-stretch"
                  style={{ boxShadow: "-2px 0 5px -2px rgba(0,0,0,0.1)" }}
                >
                  <Link
                    href={`/admin/branch/edit/${branch.id}`}
                    title="Editar sucursal"
                    className="flex-grow py-3 font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out inline-flex items-center justify-center"
                  >
                    <IoPencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDeleteBranch(branch.id, branch.name)}
                    title="Eliminar sucursal"
                    className="flex-grow py-3 font-medium text-red-600 hover:text-red-800 transition-colors duration-150 ease-in-out inline-flex items-center justify-center"
                  >
                    <IoTrashOutline size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr className="bg-white border-b border-slate-200">
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No se encontraron sucursales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};