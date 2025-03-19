import Note from "./icons/Note";

const Logo = () => {
  return (
    <div className="relative flex items-center space-x-2">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-gray-500 bg-clip-text text-transparent">
        REMINDERMEE
      </h1>
      <Note />
    </div>
  );
};

export default Logo;
