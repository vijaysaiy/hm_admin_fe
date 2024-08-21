import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { APP_ROUTES } from "@/appRoutes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import useErrorHandler from "@/hooks/useError";
import { IResetPasswordForm, UserState } from "@/types";
import { AxiosError } from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ResetPassword = () => {
  const form = useForm<IResetPasswordForm>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const user = useSelector((state: { user: UserState }) => state.user.user);
  const handleError = useErrorHandler();

  if (user) {
    return <Navigate to={APP_ROUTES.DASHBOARD} />;
  }

  const onSubmit: SubmitHandler<IResetPasswordForm> = async (
    data: IResetPasswordForm
  ) => {
    try {
      setSubmitting(true);
      console.log(data);
      //   const response = await login(data);
      //   if (response.status === 200) {
      //     const detailsRes = await getProfileDetails();
      //     const details = detailsRes.data.data;
      //     const transformedDetails = replaceNullWithEmptyString(details);
      //     dispatch(setUser(transformedDetails as User));
      //     navigate(APP_ROUTES.DASHBOARD);
      //   }
      toast.success("Logged in successfully");
    } catch (error) {
      if ((error as AxiosError).response?.status === 403) {
        return toast.error("Invalid credentials");
      }
      handleError(error, "Failed to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="************"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="************"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner type="light" />
                    Please wait...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default ResetPassword;
