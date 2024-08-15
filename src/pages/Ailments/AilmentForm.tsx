import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useWindowSize from "@/hooks/useWindowSize";
import { Ailment } from "@/types";
import { ailmentSchema } from "./schema";

const AilmentForm = ({
  setMode,
  selectedAilment,
  mode,
}: {
  showCreateAilment: boolean;
  setMode: Dispatch<SetStateAction<"view" | "create" | "edit" | null>>;
  selectedAilment: Ailment | null;
  mode: "view" | "edit" | "create";
}) => {
  const size = useWindowSize();
  const side = size.width && size.width <= 768 ? "bottom" : "right";
  const [isEditMode, setIsEditMode] = useState(mode === "edit");

  const form = useForm<Ailment>({
    resolver: zodResolver(ailmentSchema),
    defaultValues: selectedAilment || {},
  });

  const onSubmit = (data: Ailment) => {
    const payload = data;
    console.log(payload);
  };

  const handleCloseForm = (isOpen: boolean) => {
    if (!isOpen) {
      setMode(null);
      form.reset();
      setIsEditMode(false);
    }
  };

  return (
    <Sheet open={mode !== null} onOpenChange={handleCloseForm}>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>
            {mode === "create"
              ? "Add Ailment"
              : mode === "edit" || isEditMode
              ? "Edit Ailment"
              : "View Ailment"}
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="grid gap-4 p-0">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ailment Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ailment Name"
                          {...field}
                          disabled={mode === "view" && !isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Description"
                          {...field}
                          disabled={mode === "view" && !isEditMode}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <SheetFooter>
                {mode === "view" && !isEditMode ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditMode(true);
                    }}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={
                      (mode === "edit" || isEditMode) && !form.formState.isDirty
                    }
                  >
                    {mode === "edit" || isEditMode ? "Update" : "Submit"}
                  </Button>
                )}
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AilmentForm;
