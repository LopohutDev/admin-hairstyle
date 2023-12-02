// import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileEdit, Trash2 } from "lucide-react";

interface UserActionsProps {
  openEditModal: () => void;
  openDeleteModal: () => void;
}

const UserActions = ({ openEditModal, openDeleteModal }: UserActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-5 py-3 font-semibold text-gray-300 transition-all duration-200 border border-gray-500 rounded-lg hover:bg-gray-500">
        ACTIONS
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-300 bg-gray-700 border-gray-900">
        <DropdownMenuItem
          className="flex items-center gap-5"
          onClick={() => openEditModal()}
        >
          <FileEdit className="w-5" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-5"
          onClick={() => openDeleteModal()}
        >
          <Trash2 className="w-5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActions;
