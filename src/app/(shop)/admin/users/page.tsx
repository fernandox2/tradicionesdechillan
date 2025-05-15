export const revalidate = 0;

import { redirect } from "next/navigation";

import { auth } from "@/auth.config";
import { Pagination, Title } from "@/components";
import { getAllUsers } from "@/actions/users/users";
import { Filters } from "./ui/filters/Filters";
import { UsersTable } from "./ui/UsersTable";
import { User } from "@/interfaces";

interface Props {
  searchParams: {
    page?: string;
    query?: string;
  };
}

export default async function ListUserPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const query = searchParams.query || undefined;

  const session = await auth();

  if (!session) redirect("/");

  const {
    ok,
    users = [],
    totalPages,
  } = await getAllUsers({ page, query });

  if (!ok) redirect("/");

  return (
    <div className=" bg-slate-50 py-8 sm:py-12 px-4 flex justify-center items-start">
      
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 md:p-8">
      
      <div className="mb-6 md:mb-8">
        <Title title="Usuarios" subtitle="Visualiza, busca y gestiona la información de los usuarios." />
      </div>

      <div className="mb-6">
        <Filters placeholder="Buscar por nombre o correo electrónico..." />
      </div>

      <div className="border border-slate-200 rounded-lg overflow-x-auto">
        {users.length > 0 ? (
          <UsersTable users={users as User[]} />
        ) : (
          <div className="text-center py-10 px-4">
            <svg 
              className="mx-auto h-12 w-12 text-slate-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5L21 21" /> 
            </svg>
            <h3 className="mt-4 text-md font-semibold text-slate-800">No se encontraron usuarios</h3>
            <p className="mt-1 text-sm text-slate-500">
              Prueba con otros términos de búsqueda o verifica más tarde.
            </p>
          </div>
        )}
      </div>
  
        <div className="mt-6 md:mt-4 flex justify-between items-center">
         
          {users.length > 1 && (
            <p className="text-sm text-slate-500 ml-4">
              Total de usuarios: {users.length}
            </p>
          )}
          
          <Pagination totalPages={totalPages} />
         
        </div>
  
    </div>
  </div>
  );
}
