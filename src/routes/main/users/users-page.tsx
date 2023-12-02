import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import React from "react";
import UsersList from "./users-list";
import { useEffect, useState } from "react";
import AddUser from "./add-user";
import { useUserContext } from "@/context/users-context";

const SearchBar = () => {
  return (
    <div className="flex w-full">
      <Input className="bg-gray-800 border border-gray-500 rounded-r-none focus:bg-gray-600 focus:outline-none" />
      <Button
        className="text-lg bg-transparent bg-gray-500 border border-gray-500 rounded-l-none"
        variant="default"
      >
        Search
      </Button>
    </div>
  );
};

const UsersPage = () => {
  const { openSuccessModal } = useUserContext();
  const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false);

  useEffect(() => {
    if (openSuccessModal) {
      setOpenAddUserModal(false);
    }
  }, [openSuccessModal]);

  return (
    <div>
      <div className="flex items-center gap-5">
        <h1 className="text-2xl font-semibold tracking-wide">USER</h1>
        <SearchBar />
        <Button
          className="text-lg bg-transparent border-gray-500"
          variant="outline"
          onClick={() => {
            setOpenAddUserModal(true);
          }}
        >
          Add
        </Button>
      </div>
      <UsersList />
      <AddUser
        open={openAddUserModal}
        onOpenChange={(o) => setOpenAddUserModal(o)}
      />
    </div>
  );
};

export default UsersPage;
