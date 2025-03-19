"use client";

import { Button } from "./ui/button";
import { CollectionCollor, CollectionCollors, optionsDate } from "@/constant";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useEffect, useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import PlusIcon from "./icons/PlusIcon";
import TrashIcon from "./icons/TrashIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import toast from "react-hot-toast";
import { deleteCollection } from "@/actions/collection.action";
import TaskList from "./TaskList";
import CloseIcon from "./icons/CloseIcon";
import { useForm } from "react-hook-form";
import { createTaskSchema, createTaskSchemaType } from "@/schema/createTask";
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
import { Textarea } from "./ui/textarea";
import { createTask, getTasks } from "@/actions/task.action";
import { Loader2 } from "lucide-react";

const CollectionCard = ({ collection }: any) => {
  type TaskSchema = Awaited<ReturnType<typeof createTask>>;

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [isDeleting, SetIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskSchema[]>([]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: any) => task.done).length;
  const progressValue =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getTasks(collection.id);
        if (data) {
          setTasks(data);
        }

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [collection]);

  const form = useForm<createTaskSchemaType>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = async (data: createTaskSchemaType) => {
    setIsLoading(true);
    try {
      const task = await createTask({
        name: data.name,
        dueTime: data.dueTime ? new Date(data.dueTime) : null,
        collectionId: collection.id,
      });

      if (task.success) {
        toast.success("Successfully created a task");
      }
    } catch (error) {
      toast.error("Failed to create task");
    } finally {
      form.reset();
      setIsLoading(false);
      setOpenCreateTask(false);
    }
  };

  const handleDelete = async (id: number) => {
    SetIsDeleting(true);
    try {
      const data = await deleteCollection(id);
      if (data.success) {
        toast.success("Success deleted a collection");
      }
    } catch (error) {
      toast.error("Failed to delete collection");
    } finally {
      SetIsDeleting(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant={"ghost"}
          className={`w-full flex justify-between items-center h-[50px] cursor-pointer shadow-md ${
            CollectionCollors[collection.color as CollectionCollor]
          } ${isOpen ? "rounded-b-none" : "rounded-b-md"} `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-bold text-white">{collection.name}</span>
          {!isOpen && <CaretDownIcon className="w-6 h-6 text-white" />}
          {isOpen && <CaretUpIcon className="w-6 h-6 text-white" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col shadow-md rounded-b-md dark:border">
        {isOpen && (
          <div className="flex flex-col space-x-2 ">
            <Progress value={progressValue} className="rounded-none" />
            {tasks.length === 0 && (
              <div className="flex justify-center items-center mt-5 cursor-p">
                No task yet
              </div>
            )}
            <>
              <div className="p-4 flex flex-col space-y-4">
                {tasks.length > 0 &&
                  tasks.map((task: any, i) => (
                    <TaskList key={i} tasks={task} />
                  ))}
              </div>
            </>

            <Separator />

            <footer className="flex justify-between items-center h-[40px] px-4 p-[2px] text-xs">
              <p className="text-neutral-500">
                Created at{" "}
                <span>
                  {collection.createdAt.toLocaleDateString(
                    "en-Us",
                    optionsDate
                  )}
                </span>
              </p>
              <div className="flex gap-2">
                <AlertDialog
                  open={openCreateTask}
                  onOpenChange={setOpenCreateTask}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="cursor-pointer"
                    >
                      <PlusIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="flex flex-col w-full">
                    <AlertDialogHeader className="relative flex justify-center items-center ">
                      <AlertDialogTitle className="text-xl font-semibold">
                        Create Task
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Create your task on{" "}
                        <span
                          className={`bg-clip-text text-transparent ${
                            CollectionCollors[
                              collection.color as CollectionCollor
                            ]
                          }`}
                        >
                          {collection.name}
                        </span>{" "}
                        collection
                      </AlertDialogDescription>
                      <CloseIcon openCreateTask={setOpenCreateTask} />
                    </AlertDialogHeader>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col space-y-4"
                      >
                        <FormField
                          name="name"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Doing something"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="dueTime"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Time</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="date"
                                  placeholder="Select a date"
                                  value={
                                    field.value
                                      ? field.value.toISOString().split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) =>
                                    field.onChange(new Date(e.target.value))
                                  }
                                  min={new Date().toISOString().split("T")[0]}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>

                    <AlertDialogFooter>
                      <AlertDialogAction asChild>
                        <Button
                          className={`flex justify-center items-center bg-transparent hover:bg-transparent cursor-pointer text-white ${
                            CollectionCollors[
                              collection.color as CollectionCollor
                            ]
                          }`}
                          disabled={isLoading}
                          onClick={form.handleSubmit(onSubmit)}
                        >
                          Confirm
                          {isLoading && (
                            <Loader2 className="ml-1 animate-spin" />
                          )}
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="cursor-pointer"
                    >
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your collection and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          type="submit"
                          className="cursor-pointer"
                          onClick={() => handleDelete(collection.id)}
                        >
                          Confirm
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </footer>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollectionCard;
