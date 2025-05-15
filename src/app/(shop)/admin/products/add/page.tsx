import React from 'react';
import { Title } from '@/components'; 
import { ProductForm } from '../ui/ProductForm';
import { getCategories } from '@/actions/category/get-categories';


export default async function ProductAddPage() {

    const [ categories ] = await Promise.all([
        getCategories()
      ]);

  return (
   <div className="bg-slate-50 py-8 sm:py-12 px-4 flex flex-col items-center">
         <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 sm:p-8">
           
           <div className="border-b border-slate-200 pb-5 mb-6">
             <Title 
               title={ 'Crear Nuevo Producto'} 
               subtitle={'Rellena los campos para crear un producto.'}
             />
           </div>
           
           <ProductForm product= {{}} categories={categories} />
         </div>
       </div>
  );
}