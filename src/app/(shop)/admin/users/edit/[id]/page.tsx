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
    <div className="container mx-auto px-4 py-8">
      <Title title={`Editar Usuario: ${user.name || 'ID: ' + user.id.slice(0,8)}`} />
      <div className="max-w-2xl mx-auto mt-6">
        <UserForm user={user} />
      </div>
    </div>
  );
}