const CloseIcon = ({
  openCreateTask,
}: {
  openCreateTask: (arg: boolean) => void;
}) => {
  const handleOpen = () => {
    openCreateTask(false);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4 absolute right-0 top-0 cursor-pointer"
      onClick={handleOpen}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};

export default CloseIcon;
