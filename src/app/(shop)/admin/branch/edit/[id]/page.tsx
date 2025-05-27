import React from 'react';
import { notFound } from 'next/navigation';

import { Title } from '@/components'; 
import { getUserById, getUsers } from '@/actions/users/users';
import { BranchForm } from '../../ui/BranchForm';
import { getBranchById } from '@/actions/branch/create-update-branch';

interface EditBranchPageProps {
  params: {
    id: string;
  };
}

export default async function EditBranchPage({ params }: EditBranchPageProps) {
  const { id } = params;

  const branch = await getBranchById(id);
     const [ users ] = await Promise.all([
              getUsers()
            ]);

  if (!branch) {
    notFound();
  }

  return (
    <div className="bg-slate-50 py-8 sm:py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 sm:p-8">
        
        <div className="border-b border-slate-200 pb-5 mb-6">
          <Title 
            title={`Editar Distribuidor`} 
            subtitle={`${branch.name || 'ID: ' + branch.id.slice(0,8)}`}
          />
        </div>
        
        <BranchForm branch={branch} users={users} />
      </div>
    </div>
  );
}