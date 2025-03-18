"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export const createTask = async ({
  name,
  dueTime,
  collectionId,
}: {
  name: string;
  dueTime: Date | null;
  collectionId: number;
}) => {
  try {
    const userId = await getDbUserId();

    if (!userId) throw new Error("Unauthorized");

    if (!collectionId) throw new Error("There is no collection");

    const task = await prisma.task.create({
      data: {
        name,
        dueTime,
        collectionId,
        done: false,
      },
    });

    revalidatePath("/");
    return { success: true, task };
  } catch (error) {
    return { success: false, error };
  }
};

export const getTasks = async (collectionId: number) => {
  try {
    const userId = await getDbUserId();

    if (!userId) return null;

    const tasks = await prisma.task.findMany({
      where: {
        collectionId,
      },
    });

    if (!tasks) return [];

    return tasks;
  } catch (error) {
    console.log("Failed to get task", error);
  }
};

export const completedTask = async (id: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) throw new Error("Unauthorized");

    const completed = await prisma.task.update({
      where: {
        id,
      },
      data: {
        done: true,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
