"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import CreateCollectionSheet from "./CreateCollectionSheet";

const CreateCollection = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500  p-[2px]">
      <Button
        variant="outline"
        className="w-full dark:bg-black bg-white cursor-pointer dark:hover:bg-neutral-950"
        onClick={() => setOpen(true)}
      >
        <span className="bg-gradient-to-r from-red-500 to-orange-500 hover:to-orange-800 bg-clip-text text-transparent ">
          Create collection
        </span>
      </Button>
      <CreateCollectionSheet onOpen={open} onOpenChange={setOpen} />
    </div>
  );
};

export default CreateCollection;
