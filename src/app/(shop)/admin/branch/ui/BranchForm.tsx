'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import type { Branch as PrismaBranch } from '@prisma/client';
import { Mensaje } from '@/components/ui/toast/Toast';
import { upsertBranch } from '@/actions/branch/create-update-branch';

interface BranchFormInputs {
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  userId?: string;
}

interface BranchFormProps {
  branch?: Partial<PrismaBranch>;
  users?: { id: string; name?: string | null; email?: string | null }[];
}

type UpsertBranchResult = {
  ok: boolean;
  message?: string;
  code?: string;
  branch?: PrismaBranch;
};

export const BranchForm = ({ branch, users = [] }: BranchFormProps) => {

  const router = useRouter();
  const isEditing = !!branch?.id;

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<BranchFormInputs>({
    defaultValues: {
      name: branch?.name || '',
      address: branch?.address || '',
      phone: branch?.phone || '',
      email: branch?.email || '',
      lat: branch?.lat || undefined,
      lng: branch?.lng || undefined, 
      userId: branch?.userId || '',
    },
  });

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name || '',
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
        lat: branch.lat ?? undefined,
        lng: branch.lng ?? undefined,
        userId: branch.userId || '',
      });
    } else {
        reset({
            name: '',
            address: '',
            phone: '',
            email: '',
            lat: undefined,
            lng: undefined,
            userId: '',
        });
    }
  }, [branch, reset]);


  const onSubmit: SubmitHandler<BranchFormInputs> = async (data) => {
  
    const dataForAction = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      lat: data.lat,
      lng: data.lng,
      userId: data.userId === "" ? null : data.userId,
    };
  
    try {
      let result: UpsertBranchResult;
      if (isEditing && branch?.id) {
        result = await upsertBranch({ id: branch.id, ...dataForAction });
      } else {
        result = await upsertBranch(dataForAction);
      }
  
      if (!result.ok) {
        if (result.code === "P2002") {
          Mensaje(result.message || "Error: Datos duplicados (ej. email o nombre ya existen).", "error", {
            title: "Error de Duplicidad",
          });
        } else {
          Mensaje(result.message || "Error al guardar la sucursal.", "error", {
            title: "Error",
          });
        }
        return;
      }
  
      Mensaje(result.message || (isEditing ? "Sucursal actualizada" : "Sucursal creada") + " exitosamente!", "success", {
        title: isEditing ? "Actualización Exitosa" : "Creación Exitosa",
      });
  
      if (!isEditing) {
        reset();
      }
      router.push('/admin/branch');
  
    } catch (err: any) {
      console.error("Error inesperado en onSubmit al guardar sucursal:", err);
      Mensaje(err.message || "Ocurrió un error inesperado al procesar la solicitud.", "error", { title: "Error de Envío" });
    }
  };

  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 md:p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-medium text-gray-700">Nombre de la Sucursal</label>
          <input
            type="text"
            className="p-3 border rounded-md bg-gray-50 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("name", { required: "El nombre es requerido" })}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="p-3 border rounded-md bg-gray-50 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("email", { 
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Formato de email inválido"
              }
            })}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div className="md:col-span-2 flex flex-col gap-1">
          <label htmlFor="address" className="font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            className="p-3 border rounded-md bg-gray-50 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("address", { required: "La dirección es requerida" })}
          />
          {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            className="p-3 border rounded-md bg-gray-50 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("phone", { required: "El teléfono es requerido" })}
          />
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="userId" className="font-medium text-gray-700">Asignar Usuario (Opcional)</label>
          <select
            className="p-3 border rounded-md bg-gray-50 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("userId")}
            defaultValue={branch?.userId || ""}
          >
            <option value="">Sin asignar / No cambiar</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name || user.email || user.id} 
              </option>
            ))}
          </select>
          {errors.userId && <p className="text-xs text-red-600 mt-1">{errors.userId.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="lat" className="font-medium text-gray-700">Latitud</label>
          <input
            type="number"
            step="any"
            className="p-3 border rounded-md bg-gray-50 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("lat", { 
              required: "La latitud es requerida",
              valueAsNumber: true,
              min: { value: -90, message: "Latitud fuera de rango" },
              max: { value: 90, message: "Latitud fuera de rango" },
            })}
          />
          {errors.lat && <p className="text-xs text-red-600 mt-1">{errors.lat.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="lng" className="font-medium text-gray-700">Longitud</label>
          <input
            type="number"
            step="any"
            className="p-3 border rounded-md bg-gray-50 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("lng", { 
              required: "La longitud es requerida",
              valueAsNumber: true,
            //   min: { value: -180, message: "Longitud fuera de rango" },
            //   max: { value: 180, message: "Longitud fuera de rango" },
            })}
          />
          {errors.lng && <p className="text-xs text-red-600 mt-1">{errors.lng.message}</p>}
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 flex items-center justify-between pt-6 border-t mt-6">
        <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
            Volver
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar Distribuidor' : 'Crear Distribuidor')}
        </button>
      </div>
    </form>
  );
};