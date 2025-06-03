'use client';

import Image from 'next/image';

import { changePassword } from '@/actions/users/change-password';
import { useState, useTransition } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string | null;
};

interface Props {
  user: User;
}

const ProfileForm = ({ user }: Props) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    setMessage('');

    startTransition(async () => {
      try {
        await changePassword(user.id, formData.currentPassword, formData.newPassword);
        setMessage('Contraseña actualizada correctamente');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (error: any) {
        setMessage(error.message || 'Error al actualizar la contraseña');
      }
    });
  };


  const image = user.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Perfil de Usuario</h2>

      <div className="flex items-center space-x-4">
        <Image
          width={80}
          height={80}
          src={image}
          alt="Foto de perfil"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <p className="text-lg font-medium text-gray-700">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400 capitalize">{user.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Cambiar Contraseña</h3>

        <div>
          <label className="block text-sm font-medium text-gray-600">Contraseña actual</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Nueva contraseña</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Confirmar nueva contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        {message && (
          <div className={`text-sm ${message.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
