'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import type { Branch as PrismaBranch, User as PrismaUser } from '@prisma/client';

interface PaginationOptions {
  page?: number;
  take?: number;
  query?: string;
}

export interface PaginatedBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface GetPaginatedBranchesAdminResponse {
  ok: boolean;
  branches: PaginatedBranch[];
  currentPage: number;
  totalBranches: number;
  totalPages: number;
  error?: string;
}



export const getPaginatedBranchesAdmin = async ({
  page = 1,
  take = 10,
  query,
}: PaginationOptions): Promise<GetPaginatedBranchesAdminResponse> => {
  try {
    let currentPage = Number(page);
    if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

    let currentTake = Number(take);
    if (isNaN(currentTake) || currentTake < 1) currentTake = 10;

    const whereClause: Prisma.BranchWhereInput = {};
    const trimmedQuery = query?.trim();

    if (trimmedQuery && trimmedQuery !== "") {
      whereClause.OR = [
        {
          name: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: trimmedQuery,
            mode: "insensitive",
          }
        },
        {
          address: {
            contains: trimmedQuery,
            mode: "insensitive",
          }
        }
      ];
    }

    const [branchesFromDb, totalBranches] = await prisma.$transaction([
      prisma.branch.findMany({
        take: currentTake,
        skip: (currentPage - 1) * currentTake,
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.branch.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalBranches / currentTake);

    const branches: PaginatedBranch[] = branchesFromDb.map((branch) => ({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      lat: branch.lat,
      lng: branch.lng,
      createdAt: branch.createdAt,
      updatedAt: branch.updatedAt,
      userId: branch.userId,
      user: branch.user ? {
        id: branch.user.id,
        name: branch.user.name,
        email: branch.user.email,
      } : null,
    }));

    return {
      ok: true,
      branches,
      currentPage,
      totalBranches,
      totalPages,
    };
  } catch (error) {
    console.error("[getPaginatedBranchesAdmin Action] Error:", error);
    const safeCurrentPage = Number(page);
    return {
      ok: false,
      branches: [],
      currentPage: isNaN(safeCurrentPage) || safeCurrentPage < 1 ? 1 : safeCurrentPage,
      totalBranches: 0,
      totalPages: 0,
      error: "No se pudo obtener la lista de sucursales.",
    };
  }
};