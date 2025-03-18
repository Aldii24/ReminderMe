"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createCollectionSchema,
  createCollectionSchemaType,
} from "@/schema/createCollection";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CollectionCollor, CollectionCollors } from "@/constant";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useState } from "react";
import { createCollection } from "@/actions/collection.action";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type CollectionSheetProps = {
  onOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateCollectionSheet = ({
  onOpen,
  onOpenChange,
}: CollectionSheetProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<createCollectionSchemaType>({
    defaultValues: {
      name: "",
      color: "",
    },
    resolver: zodResolver(createCollectionSchema),
  });

  const onSubmit = async (data: createCollectionSchemaType) => {
    setIsLoading(true);
    try {
      const response = await createCollection({
        name: data.name,
        color: data.color,
      });

      if (response?.success) {
        toast.success("Successfully create collection");
      }
    } catch (error) {
      toast.error("Failed to create collection");
      console.log(error);
    } finally {
      setIsLoading(false);
      resetAll();
    }
  };

  const resetAll = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={onOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="text-center">
          <SheetTitle>Add New Collection</SheetTitle>
          <SheetDescription>
            Collection are a way to group your tasks
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-center w-full space-y-4 px-4"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Personal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="color"
              control={form.control}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger
                        className={`w-full ${
                          CollectionCollors[field.value as CollectionCollor]
                        }`}
                      >
                        <SelectValue
                          placeholder="Select a color"
                          className="w-full"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CollectionCollors).map((color) => (
                          <SelectItem
                            className={`w-full flex my-1 cursor-pointer hover:ring-1 hover:ring-gray-500 ${
                              CollectionCollors[color as CollectionCollor]
                            }`}
                            value={color}
                            key={color}
                          >
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>

          <div className="flex flex-col gap-3 mt-4 px-4">
            <Separator />
            <Button
              disabled={isLoading}
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className={`cursor-pointer flex items-center text-white dark:text-black ${
                form.watch("color") &&
                CollectionCollors[form.getValues("color") as CollectionCollor]
              }`}
            >
              Confirm
              {isLoading && <Loader2 className="animate-spin ml-2" />}
            </Button>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCollectionSheet;
