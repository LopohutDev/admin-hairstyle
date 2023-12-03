// import React from "react";
import { useEffect, useState } from "react";
import { PaginationContainer } from "../components/pagination-container";
import { Button } from "@/components/ui/button";
import { User, useUserContext } from "@/context/users-context";
import UserActions from "./user-actions";
import EditUser from "./edit-user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";

const UsersList = () => {
  const { users, openSuccessModal, openFailedModal, deleteUser } =
    useUserContext();
  const [page, setPage] = useState(1);
  const [openEditUserModal, setOpenEditUserModal] = useState<boolean>(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] =
    useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  useEffect(() => {
    if (openSuccessModal) {
      setOpenEditUserModal(false);
      setOpenDeleteUserModal(false);
    }
  }, [openSuccessModal]);

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * 10;
  const endIndex = startIndex + 10;
  const currentUsers = users.userList.slice(startIndex, endIndex);

  return (
    <div>
      <div>
        <table className="w-full border-separate border-spacing-y-2">
          <thead className="text-gray-300 bg-gray-700 border-gray-200">
            <tr className="rounded-lg">
              <th className="p-3 text-sm tracking-wide text-left font semibold">
                ID
              </th>
              <th className="p-3 text-sm tracking-wide text-left font semibold">
                Photo
              </th>
              <th className="p-3 text-sm tracking-wide text-left font semibold">
                Email
              </th>
              <th className="p-3 text-sm tracking-wide text-left font semibold">
                Role
              </th>
              <th className="p-3 text-sm tracking-wide text-left font semibold">
                Action
              </th>
            </tr>
          </thead>
          {users.userList && (
            <tbody>
              {currentUsers.map((user: User, index: number) => {
                return (
                  <tr
                    key={user.uid}
                    className={`shadow-sm hover:shadow-md hover:bg-gray-700  text-gray-300 transition-all duration-150  ${
                      (index + 1) % 2 == 0 ? "bg-gray-900" : "bg-gray-800"
                    }`}
                  >
                    <td className="p-3 text-smrounded-l whitespace-nowrap ">
                      <Button
                        onClick={() => navigator.clipboard.writeText(user.uid)}
                        className="text-inherit"
                      >
                        COPY ID
                      </Button>
                    </td>
                    <td className="p-3 text-sm whitespace-nowrap">
                      <div className="flex items-center justify-center overflow-hidden bg-black rounded w-14 h-14">
                        {user && user.photo ? (
                          <img
                            alt={`${user.fullName}_image`}
                            src={user.photo}
                          />
                        ) : (
                          <div className="bg-black " />
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="p-3 text-sm uppercase whitespace-nowrap">
                      {user.role}
                    </td>
                    <td className="p-3 text-sm rounded-r whitespace-nowrap ">
                      <UserActions
                        openEditModal={() => {
                          setOpenEditUserModal(true);
                          setSelectedUser(user);
                        }}
                        openDeleteModal={() => {
                          setSelectedUser(user);
                          setOpenDeleteUserModal(true);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      {/* Success Modal */}
      <Dialog open={openSuccessModal} modal>
        <DialogContent className="text-gray-100 bg-gray-900 border-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              Success!
            </DialogTitle>
            <div className="flex items-center justify-center py-10">
              <div className="flex items-center justify-center p-5 transition-all border-8 border-green-500 rounded-full animate-pop-up">
                <Check className="w-32 h-32 text-green-500" />
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* failed modal */}
      <Dialog open={openFailedModal} modal>
        <DialogContent className="text-gray-100 bg-gray-900 border-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              Something went wrong
            </DialogTitle>
            <div className="flex items-center justify-center py-10">
              <div className="flex items-center justify-center p-5 transition-all border-8 border-red-500 rounded-full animate-pop-up">
                <X className="w-32 h-32 text-red-500" />
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* delete confirmation modal */}
      <Dialog
        open={openDeleteUserModal}
        onOpenChange={(o) => setOpenDeleteUserModal(o)}
        modal
      >
        <DialogContent className="text-gray-100 bg-gray-900 border-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Do you really want to delete this user?
            </DialogTitle>
            <div className="grid grid-cols-2 gap-5 pt-10">
              <Button
                className="w-full bg-red-500 hover:bg-red-600 "
                onClick={() => setOpenDeleteUserModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-full bg-gray-600 hover:bg-gray-700 "
                onClick={async () => {
                  deleteUser(selectedUser?.uid || "");
                }}
              >
                Delete
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <EditUser
        open={openEditUserModal}
        onOpenChange={(o) => {
          setOpenEditUserModal(o);
          setSelectedUser(undefined);
        }}
        user={selectedUser}
      />
      <PaginationContainer
        totalCount={users.count}
        currentPage={page}
        pageSize={10}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UsersList;
