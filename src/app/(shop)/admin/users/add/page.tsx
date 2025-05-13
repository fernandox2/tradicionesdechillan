import React from 'react';
import UserForm from '../ui/UserForm';
import { Title } from '@/components'; 

export default async function AddUserPage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <Title title="Agregar Nuevo Usuario" />
      <div className="max-w-2xl mx-auto mt-6">
        <UserForm  />
      </div>
    </div>
  );
}