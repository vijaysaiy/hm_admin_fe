import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useWindowSize from "@/hooks/useWindowSize";
import { ICreateMedicationForm } from "@/types";
import { format } from "date-fns";
import { dosageForms, medicationSchema } from "./schema";

const MedicineForm = ({
  showCreateMedicine,
  setShowCreateMedicine,
  selectedMedicine,
  mode,
}: {
  showCreateMedicine: boolean;
  setShowCreateMedicine: Dispatch<SetStateAction<boolean>>;
  selectedMedicine: ICreateMedicationForm | null;
  mode: "view" | "edit" | "create";
}) => {
  const size = useWindowSize();
  const side = size.width && size.width <= 768 ? "bottom" : "right";
  const [isEditMode, setIsEditMode] = useState(mode === "edit");

  const form = useForm<ICreateMedicationForm>({
    resolver: zodResolver(medicationSchema),
    defaultValues:
      {
        ...selectedMedicine,
        expirationDate: selectedMedicine?.expirationDate
          ? new Date(selectedMedicine?.expirationDate)
          : selectedMedicine?.expirationDate,
      } || {},
  });

  const onSubmit: SubmitHandler<ICreateMedicationForm> = (
    data: ICreateMedicationForm
  ) => {
    const payload = {
      ...data,
      expirationDate: data.expirationDate.toString(),
    };
    console.log(payload);
  };

  const handleDateChange: Dispatch<SetStateAction<Date | undefined>> = (
    date
  ) => {
    form?.setValue("expirationDate", date as Date, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCloseForm = (isOpen: boolean) => {
    setShowCreateMedicine(isOpen);
    if (!isOpen) {
      form.reset();
      setIsEditMode(false);
    }
  };

  return (
    <Sheet open={showCreateMedicine} onOpenChange={handleCloseForm}>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>
            {mode === "create"
              ? "Add Medicine"
              : mode === "edit" || isEditMode
              ? "Edit Medicine"
              : "View Medicine"}
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="grid gap-4 p-0">
                <FormField
                  control={form.control}
                  name="medicationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Medication Name"
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Code"
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Manufacturer"
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
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        {mode === "view" && !isEditMode ? (
                          <Input
                            placeholder="Expiration Date"
                            value={
                              field.value ? format(field.value, "PPP") : ""
                            }
                            disabled
                          />
                        ) : (
                          <DatePicker
                            date={field.value as Date | undefined}
                            setDate={(date) => {
                              field.onChange(date);
                              handleDateChange(date);
                            }}
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosageForm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage Form</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={mode === "view" && !isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Dosage Form" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {dosageForms.map((form) => (
                                <SelectItem key={form} value={form}>
                                  {form}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medicationDosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Dosage</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Medication Dosage"
                          {...field}
                          disabled={mode === "view" && !isEditMode}
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

export default MedicineForm;
