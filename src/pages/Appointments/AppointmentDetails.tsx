/* eslint-disable react-hooks/exhaustive-deps */
import { APP_ROUTES } from "@/appRoutes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import useErrorHandler from "@/hooks/useError";
import {
  getAppointmentDetails,
  getMedicineList,
  updateAppointment,
} from "@/https/admin-service";
import { cn } from "@/lib/utils";
import {
  Appointment,
  IAppointmentUpdate,
  ICreateMedicationForm,
  IMedcation,
} from "@/types";
import { statusClasses } from "@/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CommandLoading } from "cmdk";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { ArrowLeft, Check, CheckIcon, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface TimeOfDayOption {
  value: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
  label: string;
}
interface foodRelationOption {
  value: "BEFORE_MEAL" | "AFTER_MEAL";
  label: string;
}

const foodRelationOptions: foodRelationOption[] = [
  {
    value: "BEFORE_MEAL",
    label: "Before Meal",
  },
  {
    value: "AFTER_MEAL",
    label: "After Meal",
  },
];
const timeOfDay: TimeOfDayOption[] = [
  {
    value: "MORNING",
    label: "Morning",
  },
  {
    value: "AFTERNOON",
    label: "Afternoon",
  },
  {
    value: "EVENING",
    label: "Evening",
  },
  {
    value: "NIGHT",
    label: "Night",
  },
];
const PRESCRIPTION_INITIAL_STATE: IMedcation = {
  medicationStockId: "",
  durationInDays: "",
  foodRelation: "",
  timeOfDay: [],
};

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate(APP_ROUTES.APPOINTMENTS);
  }
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment>();
  const [fetchingDetails, setFetchingDetails] = useState<boolean>(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const [showMedicineList, setShowMedicineList] = useState<boolean>(false);
  const [searchMedicine, setSearchMedicine] = useState<string>("");
  const [fetchingMedicines, setFetchingMedicines] = useState<boolean>(false);
  const [medicinesList, setMedicinesList] = useState<ICreateMedicationForm[]>(
    []
  );
  const [showPrescriptionDialog, setShowPrescriptionDialog] =
    useState<boolean>(false);
  const [prescription, setPrescription] = useState<IMedcation[]>([]);
  const [tempPrescription, setTempPrescription] = useState<IMedcation>(
    PRESCRIPTION_INITIAL_STATE
  );
  const [codeToMedicineMap, setCodeToMedicineMap] =
    useState<Record<string, string>>();

  const [selectedMedicine, setSelectedMedicine] =
    useState<ICreateMedicationForm | null>(null);

  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelAppointment, setCancelAppointment] = useState<boolean>(false);
  const [completeAppointment, setCompleteAppointment] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleError = useErrorHandler();

  const fetchAppointmentDetails = async () => {
    try {
      setFetchingDetails(true);
      const res = await getAppointmentDetails(id!);
      setAppointmentDetails(res.data.data);
    } catch (error) {
      handleError(error, "Error in fetching appointment details");
    } finally {
      setFetchingDetails(false);
    }
  };

  const fetchMedicineList = async () => {
    try {
      setFetchingMedicines(true);
      const response = await getMedicineList({
        search: searchMedicine,
      });
      const data = response.data.data.medicationList;
      setMedicinesList(data);
    } catch (error) {
      handleError(error, "Failed to fetch medicine list");
    } finally {
      setFetchingMedicines(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      const payload: IAppointmentUpdate = {
        status: "CANCELLED",
        appointmentId: id!,
      };
      const res = await updateAppointment(payload);
      if (res.status === 200) {
        setCancelAppointment(false);
        toast.success("Appoinement cancelled successfully");
      }
    } catch (error) {
      handleError(error, "Error cancelling appointment");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleComplete = async (remarks: string) => {
    try {
      setIsSubmitting(true);
      const payload: IAppointmentUpdate = {
        status: "COMPLETED",
        appointmentId: id!,
        prescriptions: prescription,
        doctorRemarks: remarks,
      };
      const res = await updateAppointment(payload);
      if (res.status === 200) {
        setCancelAppointment(false);
        toast.success("Appoinement updated successfully");
      }
    } catch (error) {
      handleError(error, "Failed to update the appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = debounce((search: string) => {
    setSearchMedicine(search);
  }, 900);
  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  useEffect(() => {
    fetchMedicineList();
  }, [searchMedicine]);

  useEffect(() => {
    const header = document.getElementById("header-title");
    if (header) {
      header.innerText = "Appointment Details";
    }
  }, []);

  const isPrescriptionValid = (): boolean => {
    if (tempPrescription.medicationStockId === "") return false;
    if (
      tempPrescription.durationInDays === 0 ||
      tempPrescription.durationInDays === ""
    )
      return false;
    if (tempPrescription.foodRelation === "") return false;
    if (tempPrescription.timeOfDay.length === 0) return false;
    return true;
  };

  const CancelDialogContent = () => {
    return (
      <AlertDialogContent className="max-w-[375px] md:max-w-[475px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel the
            appointment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCancelAppointment(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleCancel();
            }}
          >
            Continue
            {isCancelling && <Spinner type="light" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };
  const CompleteAppointmentContent = () => {
    const [remarks, setRemarks] = useState<string>("");
    return (
      <AlertDialogContent className="max-w-[375px] md:max-w-[475px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Appointment ?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the appointment as complete, please add remarks if
            there are any.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="doctorRemarks">Remarks</Label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCompleteAppointment(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleComplete(remarks);
            }}
          >
            Continue
            {isSubmitting && <Spinner type="light" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };

  return (
    <>
      {fetchingDetails ? (
        <div className="flex gap-2">
          <Spinner /> Fetching details...
        </div>
      ) : (
        appointmentDetails && (
          <div className="p-8">
            <Button
              variant="link"
              size="sm"
              className="mb-4"
              onClick={() => navigate(APP_ROUTES.APPOINTMENTS)}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-2" />
              Go Back
            </Button>
            <div className="flex justify-center md:justify-normal gap-8 flex-wrap">
              {/* patient details and reports */}
              <Card
                x-chunk="appointment-details-patient-details-chunk"
                className="h-fit"
              >
                <CardHeader>
                  <CardTitle>Patient Details</CardTitle>
                </CardHeader>
                <CardContent className="min-w-[300px]">
                  <div className="flex flex-col justify-between w-full gap-2 mb-2">
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-muted-foreground">Name: </p>
                      <p className="font-medium self-start">
                        {appointmentDetails?.patient.name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-muted-foreground">Mobile: </p>
                      <p className="font-medium self-start">
                        {appointmentDetails?.patient.phoneNumber}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-muted-foreground">Email: </p>
                      <p className="font-medium self-start">
                        {appointmentDetails?.patient.email}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-muted-foreground">Blood Group: </p>
                      <p className="font-medium self-start">
                        {appointmentDetails?.patient.bloodGroup}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-muted-foreground">Ailment: </p>
                      <p className="font-medium self-start">
                        {appointmentDetails?.ailment.name}
                      </p>
                    </div>
                  </div>
                  <div className="border-t-2 border-solid border-primary/10 my-4" />
                  <div className="flex flex-col justify-between w-full gap-2 mb-2 mt-4">
                    <CardTitle>Patient Reports</CardTitle>
                    <div className="flex flex-col gap-2">
                      {appointmentDetails?.patientAppointmentDocs.length ===
                        0 && <p className="text-sm">No Records Available</p>}
                      {appointmentDetails?.patientAppointmentDocs.map((doc) => (
                        <div
                          key={doc.id as string}
                          className="flex justify-between items-center"
                        >
                          <p className="text-muted-foreground">{`${
                            (doc.documentTypes as Record<string, string>).name
                          }.${doc.fileExtension}`}</p>
                          <a
                            href={doc.signedUrl as string}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Doctor details and appointment details */}
              <Card
                x-chunk="appointment-details-patient-details-chunk"
                className="h-fit"
              >
                <CardHeader className="relative">
                  <CardTitle>Doctor Details</CardTitle>
                  {appointmentDetails?.appointmentStatus && (
                    <div
                      className={`badge ${
                        statusClasses[appointmentDetails?.appointmentStatus]
                      } px-2 py-1 rounded-lg text-xs font-medium w-[90px] text-center capitalize absolute right-5 top-4`}
                    >
                      {appointmentDetails?.appointmentStatus.toLowerCase()}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="min-w-[300px]">
                  <div className="flex flex-col justify-between w-full gap-2 mb-2">
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-muted-foreground">Name: </p>
                      <p className="font-medium self-start">
                        {appointmentDetails?.doctor.name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-muted-foreground">Speciality: </p>
                      <p className="font-medium self-start">
                        {appointmentDetails?.doctor.speciality}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-muted-foreground">
                        Appointment Date:{" "}
                      </p>
                      <p className="font-medium self-start">
                        {format(appointmentDetails?.appointmentDate, "PP")}
                      </p>
                    </div>
                  </div>
                  {appointmentDetails.appointmentStatus !== "CANCELLED" && (
                    <>
                      <div className="border-t-2 border-solid border-primary/10 my-4" />
                      <div className="flex flex-col justify-between w-full gap-2 mb-2 mt-4">
                        <CardTitle>Prescription </CardTitle>
                        <div className="flex flex-col gap-2 mt-2">
                          {/* add prescription cta */}
                          {appointmentDetails.patientPrescription &&
                            appointmentDetails.patientPrescription.map(
                              (pres) => (
                                <div className="flex gap-2">
                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full border rounded-md p-2"
                                  >
                                    <AccordionItem
                                      value={
                                        pres.medicationStock?.medicationName ??
                                        ""
                                      }
                                      className="border-none"
                                    >
                                      <AccordionTrigger className="py-0">
                                        {pres.medicationStock?.medicationName}
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="flex flex-col gap-2 mt-4">
                                          <div className="flex items-center justify-between  gap-2">
                                            <p className="font-medium text-sm">
                                              Duration:
                                            </p>
                                            <p>{pres.durationInDays} days</p>
                                          </div>
                                          <div className="flex items-center justify-between  gap-2">
                                            <p className="font-medium text-sm">
                                              Time of the day:
                                            </p>
                                            <p className="capitalize">
                                              {pres.timeOfDay
                                                .map((i) =>
                                                  i
                                                    .toLowerCase()
                                                    .substring(0, 1)
                                                )
                                                .join(", ")}
                                            </p>
                                          </div>
                                          <div className="flex items-center justify-between  gap-2">
                                            <p className="font-medium text-sm">
                                              Food Relation:
                                            </p>
                                            <p>
                                              {pres.foodRelation ===
                                              "BEFORE_MEAL"
                                                ? "Before Meal"
                                                : "After Meal"}
                                            </p>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </div>
                              )
                            )}
                          {prescription.length !== 0 &&
                            prescription.map((pres) => (
                              <div className="flex gap-2">
                                <Accordion
                                  type="single"
                                  collapsible
                                  className="w-full border rounded-md p-2"
                                >
                                  <AccordionItem
                                    value={pres.medicationStockId}
                                    className="border-none"
                                  >
                                    <AccordionTrigger className="py-0">
                                      {
                                        codeToMedicineMap?.[
                                          pres.medicationStockId
                                        ]
                                      }
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="flex flex-col gap-2 mt-4">
                                        <div className="flex items-center justify-between  gap-2">
                                          <p className="font-medium text-sm">
                                            Duration:
                                          </p>
                                          <p>{pres.durationInDays} days</p>
                                        </div>
                                        <div className="flex items-center justify-between  gap-2">
                                          <p className="font-medium text-sm">
                                            Time of the day:
                                          </p>
                                          <p className="capitalize">
                                            {pres.timeOfDay
                                              .map((i) =>
                                                i.toLowerCase().substring(0, 1)
                                              )
                                              .join(", ")}
                                          </p>
                                        </div>
                                        <div className="flex items-center justify-between  gap-2">
                                          <p className="font-medium text-sm">
                                            Food Relation:
                                          </p>
                                          <p>
                                            {pres.foodRelation === "BEFORE_MEAL"
                                              ? "Before Meal"
                                              : "After Meal"}
                                          </p>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                                <Button
                                  size="icon"
                                  variant={"outline"}
                                  onClick={() =>
                                    setPrescription((prev) =>
                                      prev.filter(
                                        (i) =>
                                          i.medicationStockId !==
                                          pres.medicationStockId
                                      )
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          {appointmentDetails?.appointmentStatus ===
                            "SCHEDULED" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-fit"
                              onClick={() => {
                                setShowPrescriptionDialog(true);
                              }}
                            >
                              <Plus className="h-3.5 w-3.5 mr-2" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              {appointmentDetails?.appointmentStatus === "SCHEDULED" && (
                <div className="flex gap-2 h-fit ">
                  <Button
                    size="sm"
                    className="w-fit"
                    variant="outline"
                    onClick={() => setCancelAppointment(true)}
                  >
                    <X className="h-3.5 w-3.5 mr-2" />
                    Cancel Appointment
                  </Button>
                  <Button
                    size="sm"
                    className="w-fit"
                    onClick={() => setCompleteAppointment(true)}
                  >
                    <Check className="h-3.5 w-3.5 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      )}
      <Dialog
        open={showPrescriptionDialog}
        onOpenChange={setShowPrescriptionDialog}
      >
        <DialogContent
          className="max-w-[375px] md:max-w-[475px]"
          ref={dialogRef}
        >
          <DialogHeader>
            <DialogTitle>Add Prescription</DialogTitle>
            <DialogDescription>
              Add prescription details for the patient
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">Medicine: </p>
              <Popover
                open={showMedicineList}
                onOpenChange={setShowMedicineList}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between text-muted-foreground font-normal"
                    onClick={() => {
                      setShowMedicineList(true);
                      fetchMedicineList();
                    }}
                  >
                    {selectedMedicine
                      ? selectedMedicine.medicationName
                      : " Select Medicine"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="min-w-[325px] md:min-w-[425px] p-0"
                  align="start"
                  container={
                    dialogRef?.current === null ? undefined : dialogRef?.current
                  }
                >
                  <Command>
                    <CommandList>
                      <CommandInput
                        placeholder="Search country..."
                        onValueChange={handleSearch}
                      />
                      <ScrollArea className="h-[200px]">
                        <CommandEmpty>No Medicine found.</CommandEmpty>
                        {fetchingMedicines && (
                          <CommandLoading>
                            <div className="flex gap-2 items-center justify-center mt-4">
                              <Spinner />
                              <span className="text-muted-foreground">
                                Please wait...
                              </span>
                            </div>
                          </CommandLoading>
                        )}
                        <CommandGroup>
                          {medicinesList.map(
                            (medicine: ICreateMedicationForm) => (
                              <CommandItem
                                className="gap-2"
                                key={medicine.id}
                                value={medicine.id?.toString()}
                                onSelect={() => {
                                  setSelectedMedicine(medicine);
                                  setTempPrescription((prev) => ({
                                    ...prev,
                                    medicationStockId: medicine.id as string,
                                  }));
                                  setShowMedicineList(false);
                                  setCodeToMedicineMap((prev) => ({
                                    ...prev,
                                    [medicine.id as string]:
                                      medicine.medicationName,
                                  }));
                                }}
                              >
                                <p>{medicine.medicationName}</p>
                                {selectedMedicine?.id === medicine.id && (
                                  <CheckIcon
                                    className={cn("ml-auto h-4 w-4")}
                                  />
                                )}
                              </CommandItem>
                            )
                          )}
                        </CommandGroup>
                      </ScrollArea>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">
                Duration
                <span className="text-muted-foreground text-sm font-normal">
                  {" (in days):"}
                </span>
              </p>
              <Input
                type="text"
                placeholder="Duration in days"
                value={tempPrescription.durationInDays}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(Number(value)) || value === "") {
                    setTempPrescription((prev) => ({
                      ...prev,
                      durationInDays: value === "" ? value : Number(value),
                    }));
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">Time: </p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-muted-foreground font-normal justify-start capitalize"
                  >
                    {tempPrescription.timeOfDay.length === 0
                      ? "Select Time of the day"
                      : tempPrescription.timeOfDay
                          .map((i) => i.toLowerCase())
                          .join(", ")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[325px] md:min-w-[425px] p-0">
                  <DropdownMenuSeparator />
                  {timeOfDay.map((time: TimeOfDayOption) => (
                    <DropdownMenuCheckboxItem
                      key={time.value}
                      checked={tempPrescription?.timeOfDay?.includes(
                        time.value
                      )}
                      onCheckedChange={(isChecked: boolean) => {
                        setTempPrescription((prev) => ({
                          ...prev,
                          timeOfDay: isChecked
                            ? [...prev.timeOfDay, time.value]
                            : prev.timeOfDay.filter(
                                (val) => val !== time.value
                              ),
                        }));
                      }}
                    >
                      {time.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">Food Relation: </p>
              <div className="flex gap-5">
                {foodRelationOptions.map((option) => (
                  <div
                    className="flex items-center space-x-2"
                    key={option.value}
                  >
                    <Checkbox
                      id={option.value}
                      onCheckedChange={(isChecked) =>
                        setTempPrescription((prev) => ({
                          ...prev,
                          foodRelation: isChecked ? option.value : "",
                        }))
                      }
                      checked={tempPrescription.foodRelation === option.value}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!isPrescriptionValid()}
              onClick={() => {
                setPrescription((prev) => [...prev, tempPrescription]);
                setTempPrescription(PRESCRIPTION_INITIAL_STATE);
                setShowPrescriptionDialog(false);
                setSelectedMedicine(null);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={cancelAppointment || completeAppointment}
        onOpenChange={(open) =>
          cancelAppointment
            ? setCancelAppointment(open)
            : setCompleteAppointment(open)
        }
      >
        {cancelAppointment ? (
          <CancelDialogContent />
        ) : (
          <CompleteAppointmentContent />
        )}
      </AlertDialog>
    </>
  );
};

export default AppointmentDetails;
