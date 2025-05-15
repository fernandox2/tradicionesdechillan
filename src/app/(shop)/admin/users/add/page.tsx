import React from 'react';
import UserForm from '../ui/UserForm';
import { Title } from '@/components'; 

export default async function AddUserPage() {

  return (
   <div className="bg-slate-50 py-8 sm:py-12 px-4 flex flex-col items-center">
         <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 sm:p-8">
           
           <div className="border-b border-slate-200 pb-5 mb-6">
             <Title 
               title={ 'Crear Nuevo Usuario'} 
               subtitle={'Rellena los campos para crear un usuario.'}
             />
           </div>
           
           <UserForm />
         </div>
       </div>
  );
}