"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export const createCollection = async ({
  name,
  color,
}: {
  name: string;
  color: string;
}) => {
  try {
    const { userId } = await auth();
    const userDbId = await getDbUserId();

    if (!userDbId) return null;

    if (!userId) return null;

    const collection = await prisma.collection.create({
      data: {
        name,
        color,
        userId: userDbId,
      },
    });
    revalidatePath("/");
    return { success: true, data: collection };
  } catch (error) {
    return { success: false, error };
  }
};


export const deleteCollection = async (id: number) => {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    await prisma.collection.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
