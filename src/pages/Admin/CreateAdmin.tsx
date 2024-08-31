// src/pages/Profile.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useErrorHandler from "@/hooks/useError";
import { createAdmin, uploadAdminProfilePicture } from "@/https/admin-service";
import { ICreateUser } from "@/types";
import { ArrowLeft, Loader, UserIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { PhoneInput } from "@/components/ui/phone-input";
import Spinner from "@/components/ui/spinner";
import { APP_ROUTES } from "@/router/appRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .or(z.literal("")),
  houseNumber: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  profilePictureUrl: z.string().optional(),
  role: z.string().optional(),
});
const CreateAdmin: React.FC = () => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>();

  const imageRef = useRef<HTMLInputElement>(null);
  const handleError = useErrorHandler();
  const navigate = useNavigate();

  const form = useForm<ICreateUser>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<ICreateUser> = async (data) => {
    try {
      setSubmitting(true);
      const payload: ICreateUser = {
        ...data,
        phoneNumber: data.phoneNumber.substring(3),
        isd_code: data.phoneNumber.substring(0, 3),
        role: "ADMIN",
      };
      const res = await createAdmin(payload);
      if (res.status === 200) {
        toast.success("Admin created successfully");
        navigate(APP_ROUTES.ADMINS);
      }
    } catch (error) {
      handleError(error, "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      setUploadingImage(true);
      if (file) {
        const validImageTypes = ["image/jpeg", "image/png"];
        if (!validImageTypes.includes(file.type)) {
          toast.error("Only images are allowed");
          throw new Error("Not an image");
        }
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadAdminProfilePicture(formData);
        toast.success("Profile picture uploaded successfully");
        form.setValue("profilePictureUrl", res.data.data.bucketPath, {
          shouldDirty: true,
        });
        setProfilePicture(res.data.data.signedUrl);
      } else {
        throw new Error("No file selected");
      }
    } catch (error) {
      handleError(error, "Failed to upload profile picture");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="mx-auto w-full">
      <Button
        variant="link"
        size="sm"
        className="mb-4"
        onClick={() => navigate(APP_ROUTES.ADMINS)}
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-2" />
        Go Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Admin Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* First Row */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center w-full md:w-1/3">
              <div className="flex gap-3 items-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    // @ts-expect-error-free
                    src={profilePicture ?? form.getValues("signedUrl")}
                    alt="image"
                    className="object-fit aspect-square"
                  />
                  <AvatarFallback
                    className="hover:cursor-pointer"
                    onClick={() => imageRef?.current?.click()}
                  >
                    <UserIcon className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start ml-4">
                  <Label>Profile Picture</Label>
                  <p className="text-gray-400 text-sm mt-1">
                    Choose a photo from your device
                  </p>
                  <Button
                    variant="link"
                    onClick={(e) => {
                      e.preventDefault();
                      imageRef?.current?.click();
                    }}
                    className="mt-2 ml-[-12px]"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader className="animate-spin" />
                        Uploading...
                      </>
                    ) : form.getValues("profilePictureUrl") ? (
                      "Update Picture"
                    ) : (
                      "Add Picture"
                    )}
                  </Button>
                </div>
                <input
                  ref={imageRef}
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png"
                />
              </div>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* First Row */}

              <div className="flex flex-wrap gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>
                        Name<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>
                        Phone Number<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="IN"
                          placeholder="Enter a phone number"
                          {...field}
                          onChange={(val) => {
                            field.onChange(val);
                            form.trigger("phoneNumber");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>
                        Email<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            form.trigger("email");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <hr className="my-4" />

              {/* Third Row */}
              <p className="font-semibold text-md">
                Address Details{" "}
                <span className="text-muted-foreground text-sm">
                  (optional)
                </span>
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="houseNumber"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>House Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>Colony</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2 lg:w-1/4 mb-4">
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full justify-end">
                <Button
                  type="submit"
                  className="md:w-fit w-full mt-4 self-right"
                  disabled={submitting || !form.formState.isDirty}
                >
                  {submitting ? (
                    <>
                      <Spinner type="light" />
                      Please wait...
                    </>
                  ) : (
                    "Create Admin"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdmin;
