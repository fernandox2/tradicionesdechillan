import Link from 'next/link';
import type { User } from '@/interfaces';
import { IoPencil } from 'react-icons/io5';

interface UsersTableProps {
  users: User[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
    <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-700">
      <thead className="text-xs border text-gray-700 uppercase bg-white dark:bg-gray-200 dark:text-gray-600 border-b dark:border-gray-300">
        <tr>
          <th scope="col" className="px-6 py-3">
            ID
          </th>
          <th scope="col" className="px-6 py-3">
            Nombre
          </th>
          <th scope="col" className="px-6 py-3">
            Email
          </th>
          <th scope="col" className="px-6 py-3">
            Rol
          </th>
          <th scope="col" className="px-6 py-3">
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="bg-white border dark:border-gray-300 hover:bg-blue-50 dark:hover:bg-gray-100 transition-colors duration-150 ease-in-out"
          >
            <td className="px-6 py-4 font-mediu whitespace-nowrap uppercase">
              {user.id.slice(0, 8)}
            </td>
            <td className="px-6 py-4">
             {user.name || 'N/A'}
            </td>
            <td className="px-6 py-4">
              {user.email}
            </td>
            <td className="px-6 py-4">
              {user.role}
            </td>
            <td className="px-6 py-4">
              <Link
                href={`/admin/users/edit/${user.id}`}
                title="Editar usuario"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-150 ease-in-out inline-flex items-center"
              >
                <IoPencil size={16} className="mr-1" />
                Editar
              </Link>
            </td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr className="bg-white dark:bg-gray-300 border">
            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No se encontraron usuarios.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  );
};