"use server";

import prisma from "@/lib/prisma";

import type { Address } from "@/interfaces";


export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: newAddress,
    };
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      message: "No se pudo grabar la dirección",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId: userId },
    });

    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2 || "",
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
      city: address.city
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave,
    });

    return updatedAddress;
  } catch (e) {
    console.log(e);
    throw new Error("No se pudo grabar la dirección");
  }
};

export const deleteUserAddress = async (userId: string) => {
  try {
    const deleted = await prisma.userAddress.delete({
      where: { userId },
    });

    return { ok: true, deleted: deleted };
  } catch (e) {
    console.log(e);
    throw new Error("No se pudo eliminar la dirección del usuario");
  }
};

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: { userId },
    });

    if (!address) return undefined

    const { countryId, ...resto } = address

    return {
      ...resto,
      country: countryId
    }
  } catch (e) {
    console.log(e);
    return undefined
  }
};
