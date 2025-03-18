import { Skeleton } from "./ui/skeleton";

const SkeletonCollections = () => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <Skeleton className="w-full h-[60px]" />
      <Skeleton className="w-full h-[60px]" />
      <Skeleton className="w-full h-[60px]" />
    </div>
  );
};

export default SkeletonCollections;
