import React from 'react';
import { notFound } from 'next/navigation';

import UserForm from '../../ui/UserForm';
import { Title } from '@/components'; 
import { getUserById } from '@/actions/users/users';

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params;

  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="bg-slate-50 py-8 sm:py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 sm:p-8">
        
        <div className="border-b border-slate-200 pb-5 mb-6">
          <Title 
            title={`Editar Usuario`} 
            subtitle={`${user.name || 'ID: ' + user.id.slice(0,8)}`}
          />
        </div>
        
        <UserForm user={user} />
      </div>
    </div>
  );
}