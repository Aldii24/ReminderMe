"use client";

import toast from "react-hot-toast";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useState } from "react";
import { completedTask } from "@/actions/task.action";

const TaskList = ({ tasks }: { tasks: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const data = await completedTask(tasks.id);

      if (data.success) {
        toast.success("Successfully completed a task");
      }
    } catch (error) {
      toast.error("Failed to completed task");
    }
  };

  return (
    <div
      className={`flex items-center gap-2 ${
        tasks.done && "line-through decoration-red-800"
      }`}
    >
      <div>
        <Checkbox
          onClick={handleComplete}
          checked={tasks.done}
          className={`cursor-pointer ${
            tasks.done ? "line-through opacity-50" : ""
          }`}
          disabled={tasks.done || isLoading}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label
          className="font-normal dark:text-gray-200 text-gray-900"
          htmlFor="task"
        >
          {tasks.name}
        </Label>
        {tasks.dueTime && (
          <span className="text-xs dark:text-muted text-gray-500">
            {tasks.dueTime.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskList;
