"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "@/lib/axios";
import { calculateAge } from "@/lib/helpers";
import dayjs from "dayjs";

export type User = {
  createdAt: string;
  email: string;
  fullName: string;
  photo: string;
  role: string;
  uid: string;
  feedback?: string;
  rating?: number;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
};

export type UserResponse = {
  userList: User[];
  count: number;
};

export interface UserContextType {
  users: UserResponse;
  addUser: (data: AddUserRequest) => Promise<void>;
  editUser: (data: EditUserRequest, uid: string) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  openSuccessModal: boolean;
  openFailedModal: boolean;
}

interface AddUserRequest {
  fullName: string;
  role: string;
  gender: string;
  phoneNumber: string;
  photoBase64: string;
  dob: string;
}

interface EditUserRequest {
  fullName: string;
  role: string;
  gender: string;
  phoneNumber: string;
  photoBase64: string;
}

const defaultUserContext: UserContextType = {
  users: {
    userList: [],
    count: 0,
  },
  addUser: async () => {},
  editUser: async () => {},
  deleteUser: async () => {},
  openSuccessModal: false,
  openFailedModal: false,
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserResponse>({ userList: [], count: 0 });
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const [isAddSuccess, setIsAddSuccess] = useState<boolean>(false);
  const [isEditSuccess, setIsEditSuccess] = useState<boolean>(false);
  const [isDeleteSuccess, setDeleteSuccess] = useState<boolean>(false);

  const [isDeleteFailed, setIsDeleteFailed] = useState<boolean>(false);
  const [isEditFailed, setIsEditFailed] = useState<boolean>(false);
  const [isAddFailed, setIsAddFailed] = useState<boolean>(false);

  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [openFailedModal, setOpenFailedModal] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      const userList = (await axios.get("/users")).data as UserResponse;

      setUsers(userList);
    };

    getUsers();
  }, []);

  // success request
  useEffect(() => {
    if (isAddSuccess || isEditSuccess || isDeleteSuccess) {
      let timeoutId = setTimeout(() => {
        setOpenSuccessModal(false);
      }, 1000);

      setTimer(timeoutId);
      setOpenSuccessModal(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);

        setIsAddSuccess(false);
        setIsEditSuccess(false);
        setDeleteSuccess(false);

        setOpenSuccessModal(false);
      }
    };
  }, [isAddSuccess, isEditSuccess, isDeleteSuccess]);

  // failed request
  useEffect(() => {
    if (isAddFailed || isEditFailed || isDeleteFailed) {
      let timeoutId = setTimeout(() => {
        setOpenFailedModal(false);
      }, 1000);

      setTimer(timeoutId);
      setOpenFailedModal(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);

        setIsAddSuccess(false);
        setIsEditSuccess(false);
        setDeleteSuccess(false);

        setOpenFailedModal(false);
      }
    };
  }, [isAddFailed, isEditFailed, isDeleteFailed]);

  const addUser = async (data: AddUserRequest) => {
    try {
      const age = calculateAge(data.dob).years.toString();
      const formattedDoB = dayjs(data.dob).format("DD/MM/YYYY");

      await axios.post("/users", {
        ...data,
        age,
        dob: formattedDoB,
      });

      setIsAddSuccess(true);
      setIsAddFailed(false);
    } catch (error) {
      setIsAddSuccess(false);
      setIsAddFailed(true);
    }
  };

  const editUser = async (data: EditUserRequest, uid: string) => {
    try {
      await axios.put(`/users/${uid}`, {
        ...data,
      });

      setIsEditFailed(false);
      setIsEditSuccess(true);
    } catch (error) {
      setIsEditFailed(false);
      setIsEditSuccess(true);
    }
  };

  const deleteUser = async (uid: string) => {
    try {
      await axios.delete(`/users/${uid}`);

      setIsDeleteFailed(false);
      setDeleteSuccess(true);
    } catch (error) {
      setDeleteSuccess(false);
      setIsDeleteFailed(true);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        editUser,
        deleteUser,
        openSuccessModal,
        openFailedModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
