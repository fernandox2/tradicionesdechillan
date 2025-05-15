// src/components/admin/users/UserForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { upsertUserAction, UserFormState, UserForForm } from '@/actions/users/users';
import { Role } from '@prisma/client';
import { Mensaje } from '@/components/ui/toast/Toast';

interface UserFormProps {
  user?: UserForForm | null;
  availableRoles?: Role[];
}

const SubmitButton = ({ isEditing }: { isEditing: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400"
    >
      {pending ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario')}
    </button>
  );
}

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      type="button" // Importante que sea type="button" para no enviar el formulario
      onClick={() => router.back()}
      className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-400"
    >
      Volver
    </button>
  );
}

export default function UserForm({ user, availableRoles = Object.values(Role) }: UserFormProps) {
  const router = useRouter();
  const initialState: UserFormState = { message: '', errors: {}, success: false, isEdit: !!user };
  const [formState, formAction] = useFormState(upsertUserAction, initialState);

  useEffect(() => {
    if (formState.success) {

      Mensaje(formState.message, 'success', {
        title: formState.isEdit ? 'Usuario Actualizado' : 'Usuario Creado'
      });
      
      if (formState.isEdit && formState.userId) {
        
        router.push('/admin/users');
      } else {
        router.push('/admin/users');
      }
    }
  }, [formState, router]);

  const isEditing = !!user;

  return (
    <form action={formAction} className="space-y-4 ">
      {user?.id && <input type="hidden" name="id" value={user.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user?.name ?? ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formState.errors?.name && (
          <p className="mt-1 text-xs text-red-600">{formState.errors.name.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email ?? ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formState.errors?.email && (
          <p className="mt-1 text-xs text-red-600">{formState.errors.email.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña {isEditing ? '(Dejar en blanco para no cambiar)' : ''}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={isEditing ? '••••••••' : 'Mínimo 6 caracteres'}
        />
        {formState.errors?.password && (
          <p className="mt-1 text-xs text-red-600">{formState.errors.password.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Rol
        </label>
        <select
          id="role"
          name="role"
          defaultValue={user?.role ?? Role.user}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {formState.errors?.role && (
          <p className="mt-1 text-xs text-red-600">{formState.errors.role.join(', ')}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          URL de Imagen (Opcional)
        </label>
        <input
          id="image"
          name="image"
          type="url"
          defaultValue={user?.image ?? ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {formState.errors?.image && (
          <p className="mt-1 text-xs text-red-600">{formState.errors.image.join(', ')}</p>
        )}
      </div>

      {formState.errors?._form && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{formState.errors._form.join(', ')}</p>
        </div>
      )}
      {!formState.success && formState.message && !formState.errors?._form && (
         <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{formState.message}</p>
        </div>
      )}


      <div className="flex items-center justify-between pt-4">
      <BackButton />
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}