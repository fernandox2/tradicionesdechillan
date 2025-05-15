import Link from 'next/link';
import Image from 'next/image';

import { IoPencil, IoCubeOutline } from 'react-icons/io5';
import type { Product } from '@/interfaces';

interface ProductsTableProps {
  products: Product[];
}

export const ProductsTable = ({ products }: ProductsTableProps) => {

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

  return (
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
            <th scope="col" className="px-4 py-3 md:px-6 hidden md:table-cell">
              Precio
            </th>
            <th scope="col" className="px-4 py-3 md:px-6 hidden lg:table-cell">
              Stock
            </th>
            <th scope="col" className="px-4 py-3 md:px-6 hidden lg:table-cell">
              Tallas
            </th>
            <th scope="col" className="px-4 py-3 md:px-6">
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
              <td className="px-4 py-3 md:px-6 hidden md:table-cell">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3 md:px-6 hidden lg:table-cell">
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
             <td className="px-4 py-3 md:px-6 hidden lg:table-cell">
              {product.sizes.map(size => sizeLabels[size] ?? size).join(', ')}
            </td>
              <td className="px-4 py-3 md:px-6">
                <Link
                  href={`/admin/products/edit/${product.slug}`}
                  title="Editar producto"
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out inline-flex items-center"
                >
                  <IoPencil size={16} className="mr-1" />
                  Editar
                </Link>
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
  );
};