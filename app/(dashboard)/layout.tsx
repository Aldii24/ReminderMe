import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full items-center">
      <div className="flex flex-grow w-full justify-center dark:bg-neutral-950">
        <div className="flex flex-col max-w-[950px] flex-grow px-4 py-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
