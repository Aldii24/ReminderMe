import { getDbUserId, syncUser } from "@/actions/user.action";
import CollectionCard from "@/components/CollectionCard";
import CreateCollection from "@/components/CreateCollection";
import SadFace from "@/components/icons/SadFace";
import SkeletonCollections from "@/components/SkeletonCollections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function Home() {
  const user = await auth();

  if (!user) return null;

  await syncUser();

  return (
    <main>
      <Suspense fallback={<SkeletonLoading />}>
        <WelcomeMessage />
      </Suspense>
      <Suspense fallback={<SkeletonCollections />}>
        <CollectionList />
      </Suspense>
    </main>
  );
}

const WelcomeMessage = async () => {
  const user = await currentUser();
  console.log(user);

  if (!user) return null;

  return (
    <h1 className="flex flex-col text-4xl font-bold mb-12">
      Welcome,
      <span className="capitalize">
        {user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.emailAddresses[0].emailAddress.split("@")[0]}
      </span>
    </h1>
  );
};

const SkeletonLoading = () => {
  return (
    <main className="flex flex-col gap-2 mb-12">
      <Skeleton className="w-[160px] h-[40px]" />
      <Skeleton className="w-[190px] h-[40px]" />
    </main>
  );
};

const CollectionList = async () => {
  const user = await currentUser();
  const dbUserId = await getDbUserId();

  if (!dbUserId) return null;

  if (!user) return null;

  const collections = await prisma.collection.findMany({
    where: {
      userId: dbUserId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (collections.length === 0) {
    return (
      <div className="w-full">
        <Alert className="flex items-center space-x-4 mb-6">
          <div>
            <SadFace />
          </div>
          <div>
            <AlertTitle>There are no collection yet!</AlertTitle>
            <AlertDescription>
              Create a collection to get started
            </AlertDescription>
          </div>
        </Alert>
        <CreateCollection />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <CreateCollection />
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};
