import React from 'react';
import { Title } from '@/components'; 
import { ProductForm } from '../../ui/ProductForm';
import { getProductBySlug } from '@/actions';
import { getCategories } from '@/actions/category/get-categories';
import { redirect } from 'next/navigation';

interface Props {
    params: {
      slug: string;
    }
  }

  export default async function ProductEditPage({ params }: Props) {

    const { slug } = params;

    const [ product, categories ] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
      ]);

      if ( !product && slug !== 'new' ) {
        redirect('/admin/products')
      }

  return (
   <div className="bg-slate-50 py-8 sm:py-12 px-4 flex flex-col items-center">
         <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 sm:p-8">
           
           <div className="border-b border-slate-200 pb-5 mb-6">
             <Title 
               title={ 'Crear Nuevo Producto'} 
               subtitle={'Rellena los campos para crear un producto.'}
             />
           </div>
           
           <ProductForm product={product ?? {}} categories={categories} />
         </div>
       </div>
  );
}