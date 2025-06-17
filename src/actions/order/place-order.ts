"use server";

import prisma from "@/lib/prisma";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import { getUniqueNumber } from "@/utils";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsIds: ProductToOrder[],
  address: Address
) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return { ok: false, message: "Unauthorized" };
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productsIds.map((product) => product.productId),
        },
      },
    });

    // ** Calcular Montos
    const itemsInOrder = productsIds.reduce(
      (count, p) => count + p.quantity,
      0
    );

    // ** Calcular Totales
    const { subTotal, tax, total } = productsIds.reduce(
      (totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find(
          (product) => product.id === item.productId
        );

        if (!product) {
          throw new Error("Product not found " + item.productId);
        }

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.19;
        totals.total += subTotal * 1.19;

        return totals;
      },
      { subTotal: 0, tax: 0, total: 0 }
    );

    // ** Realizar la transacción en la DB
    try {
      const prismaTx = await prisma.$transaction(async (tx) => {
        // ** 1. Actualizar el stock de los productos
        const updatedProductsPromises = products.map((product) => {
          const productQuantity = productsIds
            .filter((p) => p.productId === product.id)
            .reduce((acc, p) => acc + p.quantity, 0);

          if (productQuantity === 0) {
            throw new Error("Product no tiene una cantidad definida");
          }

          return tx.product.update({
            where: {
              id: product.id,
            },
            data: {
              inStock: {
                decrement: productQuantity,
              },
            },
          });
        });

        const updatedProducts = await Promise.all(updatedProductsPromises);

        updatedProducts.forEach((product) => {
          if (product.inStock < 0) {
            throw new Error(
              "No hay stock suficiente para el producto " + product.title
            );
          }
        });

        // ** 2. Crear la orden de compra y los detalles
        const order = await tx.order.create({
          data: {
            id: getUniqueNumber().toString(),
            userId,
            itemsInOrder,
            subTotal,
            tax,
            total,

            OrderItem: {
              createMany: {
                data: productsIds.map((product) => ({
                  productId: product.productId,
                  quantity: product.quantity,
                  size: product.size,
                  price:
                    products.find((p) => p.id === product.productId)?.price ??
                    0,
                })),
              },
            },
          },
        });

        // ** 3. Crear la dirección de la orden
        const { country, ...restAddress } = address;

        console.log({ restAddress})

        const orderAddress = await tx.orderAddress.create({
          data: {
            firstName: restAddress.firstName,
            lastName: restAddress.lastName,
            phone: restAddress.phone,
            address: restAddress.address,
            city: restAddress.city,
            postalCode: restAddress.postalCode,
            address2: restAddress.address2 ?? '',
            countryId: country ?? "CL",
            orderId: order.id,
          },
        });

        return {
          order: order,
          orderAddress: orderAddress,
          updatedProducts: updatedProducts,
        };
      });

      return {
        ok: true,
        order: prismaTx.order,
        prismaTx: prismaTx,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error.message,
      };
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const session = await auth();

    if (!session) {
      return { ok: false, message: "Unauthorized" };
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        OrderItem: {
          include: {
            product: {
              include: {
                ProductImage: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
        OrderAddress: true,
      },
    });

    if (!order) {
      return { ok: false, message: "Orden no encontrada" };
    }

    if (session.user.role === "user") {
      if (order.userId !== session.user.id) {
        return { ok: false, message: "Unauthorized" };
      }
    }

    return {
      ok: true,
      order: order,
    };
  } catch (e: any) {
    return {
      ok: false,
      message: e.message,
    };
  }
};

export const getOrdersByUser = async (userId: string) => {
  try {
    if (!userId) {
      return { ok: false, message: "El userId es obligatorio" };
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        OrderItem: {
          include: {
            product: {
              include: {
                ProductImage: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
        OrderAddress: true,
      },
    });

    return {
      ok: true,
      orders: orders,
    };
  } catch (e: any) {
    return {
      ok: false,
      message: e.message,
    };
  }
};

export const updateAndPayOrder = async (orderId: string, token_ws: string) => {
  try {
    const session = await auth();

    if (!session) {
      return { ok: false, message: "Unauthorized" };
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return { ok: false, message: "Orden no encontrada" };
    }

    if (session.user.role === "user") {
      if (order.userId !== session.user.id) {
        return { ok: false, message: "Unauthorized" };
      }
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        transactionId: token_ws,
        paidAt: new Date(),
      },
    });

    return {
      ok: true,
      order: updatedOrder,
    };
  } catch (e: any) {
    return {
      ok: false,
      message: e.message,
    };
  }
};

export const getAllOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        OrderItem: {
          include: {
            product: {
              include: {
                ProductImage: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
        OrderAddress: true,
      },
    });

    return {
      ok: true,
      orders: orders,
    };
  } catch (e: any) {
    return {
      ok: false,
      message: e.message,
    };
  }
}
