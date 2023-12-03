import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { ChangeEvent, useState } from "react";
import { useUserContext } from "@/context/users-context";

interface AddUserForm {
  email: string;
  password: string;
  fullName: string;
  role: string;
  gender: string;
  dob: string;
  phoneNumber: string;
  photoBase64: string;
}

type AddUserModalProps = DialogProps;

const formSchema = z.object({
  email: z.string({ required_error: "Email is Required" }),
  password: z.string({ required_error: "Password is Required" }),
  fullName: z.string({ required_error: "Full Name is Required" }),
  role: z.string(),
  gender: z.string(),
  dob: z.string({ required_error: "Date of Birth is Required" }),
  phoneNumber: z.string({ required_error: "Phone Number is Required" }),
  photoBase64: z.string(),
});

const AddUser = ({ open, onOpenChange }: AddUserModalProps) => {
  const [base64String, setBase64String] = useState<string>("");
  const { addUser } = useUserContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      email: "",
      password: "",
      dob: "",
      fullName: "",
      gender: "",
      phoneNumber: "",
      role: "user",
      photoBase64: "",
    },
  });

  const onSubmit = async (data: AddUserForm) => {
    await addUser({ ...data, photoBase64: base64String });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto text-gray-100 bg-gray-900 border-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Add User
          </DialogTitle>
          <div className="input:text-black">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* FORM Start */}
                <div>
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="w-full text-black bg-gray-100 border-gray-300"
                              placeholder="example@email.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="w-full text-black bg-gray-100 border-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="ex. John Doe"
                              className="w-full text-black bg-gray-100 border-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 mt-2">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="w-full text-black bg-gray-100 border-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-black">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full text-black bg-gray-100 border-gray-300"
                              placeholder="ex. 09123456789"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 mt-2">
                    <FormField
                      control={form.control}
                      name="photoBase64"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Photo</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0] || null;

                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setBase64String(
                                      reader.result?.toString().split(",")[1] ||
                                        ""
                                    );
                                  };
                                  reader.readAsDataURL(file);
                                }

                                form.setValue("photoBase64", e.target.value);
                              }}
                              type="file"
                              accept="image/png"
                              className="w-full text-black bg-gray-100 border-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-black">
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* FORM end */}
                <div className="grid grid-cols-2 gap-5">
                  <Button
                    type="submit"
                    className="w-full mt-5 bg-gray-500 hover:bg-gray-600"
                  >
                    Add User
                  </Button>
                  <Button
                    // type="submit"
                    className="w-full mt-5 bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      onOpenChange && onOpenChange(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
