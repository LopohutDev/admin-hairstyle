import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import { Home, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface NavLinksProps {
  link: string;
  title: string;
  icon: React.ReactNode;
}

const NavLinks = ({ link, icon, title }: NavLinksProps) => {
  return (
    <Link to={link} className="flex items-center gap-5">
      {icon}
      <span>{title}</span>
    </Link>
  );
};

const SideNav = () => {
  const { handleLogout } = useAuthContext();
  return (
    <div className="w-[20%] border-r border-gray-800 p-5">
      <div className="flex items-center justify-center bg-gray-700 h-14">
        Logo
      </div>
      <div className="mt-5">
        <h5 className="text-xs text-gray-500">MAIN</h5>
        <div className="flex flex-col gap-3 mt-5 ">
          <NavLinks
            icon={<Home className="w-5" />}
            link="/dashboard"
            title="Home"
          />
          <NavLinks
            icon={<User className="w-5" />}
            link="/users"
            title="Users"
          />

          <hr className="my-4 border-gray-700" />

          <Button
            className="bg-gray-700 hover:bg-gray-800"
            onClick={handleLogout}
          >
            Logout
          </Button>
          {/* <NavLinks icon={<Upload className="w-5" />} link="" title="Upload" /> */}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
