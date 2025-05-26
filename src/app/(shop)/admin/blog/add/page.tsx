import React from 'react';
import { Title } from '@/components'; 

import { ArticleForm } from '../ui/ArticleForm';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';

export default async function ArticleAddPage() {

    const session = await auth();
    
    if (!session) redirect("/");

    const { id } = session.user; 

  return (
   <div className="bg-slate-50 py-8 sm:py-12 px-4 flex flex-col items-center">
         <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 sm:p-8">
           
           <div className="border-b border-slate-200 pb-5 mb-6">
             <Title 
               title={ 'Crear Nuevo articulo'} 
               subtitle={'Rellena los campos para crear un articulo.'}
             />
           </div>
           
           <ArticleForm article= {{}} userId={id} />
         </div>
       </div>
  );
}