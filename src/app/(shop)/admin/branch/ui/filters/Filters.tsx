'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoSearchOutline, IoAddCircleOutline } from 'react-icons/io5'; 

interface Props {
    placeholder?: string;
    addProductHref?: string;
  }

export const Filters = ({ placeholder = "Buscar por nombre...",  addProductHref = "/admin/branch/add" }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebounce((term: string) => {

    const params = new URLSearchParams(searchParams);

    params.set('page', '1');

    if (term && term.trim() !== "") {
      params.set('query', term.trim());
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex items-center space-x-2 sm:space-x-4 mb-6">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get('query')?.toString() || ''}
          className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          aria-label="Buscar usuarios"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IoSearchOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <Link
        href={addProductHref}
        className="flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-blue-300 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-700 whitespace-nowrap"
      >
        <IoAddCircleOutline className="w-5 h-5 mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Agregar Branch</span>
        <span className="sm:hidden">Agregar</span>
      </Link>
    </div>
  );
}