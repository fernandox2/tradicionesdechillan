'use client';

import Link from 'next/link';
import Image from 'next/image';

import { IoPencil, IoCubeOutline, IoTrashOutline } from 'react-icons/io5';
import type { Product } from '@/interfaces';
import { deleteProduct } from '@/actions/product/delete-product';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { useState } from 'react';

interface ProductsTableProps {
  products: Product[];
}

export const ProductsTable = ({ products }: ProductsTableProps) => {

  const route = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sizeLabels: Record<string, string> = {
    XS: "XS",
    S: "S",
    M: "M",
    L: "L",
    XL: "XL",
    XXL: "XXL",
    XXXL: "XXXL",
    NINE_HUNDRED_GRAMS: "900GRMS",
    FOUR_HUNDRED_FIFTY_GRAMS: "450GRMS",
    TWO_HUNDRED_FIFTY_GRAMS: "250GRMS",
  };

  const eliminarProducto = async (productId: string) => {
    setDeletingId(productId);
    await deleteProduct(productId);
    route.refresh();
    setDeletingId(null);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
  {deletingId && (
    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
      <FaSpinner className="animate-spin text-gray-600 text-2xl" />
    </div>
  )}
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full text-sm text-left text-slate-700">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-300">
          <tr>
            <th scope="col" className="px-4 py-3 md:px-6">
              Imagen
            </th>
            <th scope="col" className="px-4 py-3 md:px-6">
              Título
            </th>
            <th scope="col" className="px-4 py-3 md:px-6 md:table-cell">
              Precio
            </th>
            <th scope="col" className="px-4 py-3 md:px-6 lg:table-cell">
              Stock
            </th>
            <th scope="col" className="px-4 py-3 md:px-6 lg:table-cell">
              Tallas
            </th>
            <th scope="col"className="w-24 px-4 py-3 md:px-6 bg-white sticky right-0 z-10">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => 
          (
            
            <tr
              key={product.id}
              className="bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150 ease-in-out"
            >
              <td className="px-4 py-3 md:px-6">
                {product.images && product.images.length > 0 ? (
                  <Image
                  src={product.images[0].startsWith('http') ? product.images[0] : `/${product.images[0]}`}
                  alt={product.title}
                    width={50}
                    height={50}
                    className="rounded object-cover w-12 h-12"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                    <IoCubeOutline size={24} className="text-slate-400" />
                  </div>
                )}
              </td>
              <td className="px-4 py-3 md:px-6 font-medium text-slate-900 max-w-xs">
                <Link href={`/product/${product.slug}`} className="hover:text-blue-600 transition-colors" title={product.title}>
                  {product.title}
                </Link>
                <p className="text-xs text-slate-500 uppercase">{product.id.split('-')[0]}</p>
              </td>
              <td className="px-4 py-3 md:px-6 md:table-cell">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3 md:px-6 lg:table-cell">
                {product.inStock > 0 ? (
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.inStock < 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.inStock}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Agotado
                  </span>
                )}
              </td>
             <td className="px-4 py-3 md:px-6 lg:table-cell">
              {product.sizes.map(size => sizeLabels[size] ?? size).join(', ')}
            </td>

            <td
                  className="px-4 py-4 md:px-6 w-30 bg-gray-100 sticky right-0 z-10 space-x-2 flex items-stretch"
                  style={{ boxShadow: "-2px 0 5px -2px rgba(0,0,0,0.1)" }}
                >
                  <Link
                    href={`/admin/products/edit/${product.slug}`}
                    title="Editar artículo"
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out inline-flex items-center"
                  >
                    <IoPencil size={16} />
                  </Link>
                  
                  <button
                    onClick={() => {
                      eliminarProducto(product.id)
                    }}
                    title="Eliminar articulo"
                    className="flex-grow py-3 font-medium text-red-600 hover:text-red-800 transition-colors duration-150 ease-in-out inline-flex items-center justify-center"
                  >
                    <IoTrashOutline size={16} />
                  </button>
                </td>

              
            </tr>
          ))}
          {products.length === 0 && (
            <tr className="bg-white border-b border-slate-200">
              <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};