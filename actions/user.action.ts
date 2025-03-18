"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { User } from "lucide-react";

export const syncUser = async () => {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!user) return null;

    if (!clerkId) return null;

    const existingUser = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });

    if (existingUser) return existingUser;

    const newUser = await prisma.user.create({
      data: {
        clerkId,
        username: user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.emailAddresses[0].emailAddress.split("@")[0],
      },
    });

    return newUser;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

export const getDbUserId = async () => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) return null;

    const user = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });

    return user?.id;
  } catch (error) {
    throw new Error("Failed to get user id");
  }
};
