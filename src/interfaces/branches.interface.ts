import { User } from "next-auth";
import { Branch as PrismaBranch } from '@prisma/client'; 

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  schedule: string;
  website: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  userId?: string;
  }

  export interface BranchFormState {
    message: string;
    errors?: {
      name?: string[];
      address?: string[];
      phone?: string[];
      email?: string[];
      lat?: string[];
      lng?: string[];
      userId?: string[];
      _form?: string[]; // Errores generales del formulario
    };
    success: boolean;
    isEdit: boolean;
    branchId?: string; // ID de la sucursal procesada
  }
  
  // Tipo para los datos de la sucursal que se pasan al formulario para edición
  // Asegúrate de que tu interfaz Branch en '@/interfaces' coincida o usa esta
  export type BranchForForm = Pick<
    PrismaBranch, // O tu interfaz Branch si es diferente
    'id' | 'name' | 'address' | 'phone' | 'email' | 'lat' | 'lng' | 'userId'
  > | null; // Permite null si es para crear una nueva