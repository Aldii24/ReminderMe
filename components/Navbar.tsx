import { UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "./ThemeSwitcher";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="sticky top-0 flex w-full justify-between p-4 xl:px-[170px] h-[60px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <Logo />

      <div className="flex gap-4 items-center">
        <UserButton />
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
