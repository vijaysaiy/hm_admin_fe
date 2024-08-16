import {
  CalendarCheck,
  CheckCircle2,
  Eye,
  Hourglass,
  MoreVertical,
  Search,
  X,
} from "lucide-react";

import { APP_ROUTES } from "@/appRoutes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const appointments: Appointment[] = [
  {
    id: "clzmboszg0001iy18ty19sf55",
    appointmentDate: "2024-08-09T06:26:30.898Z",
    appointmentStatus: "CANCELLED",
    doctor: {
      id: "clz8bgm9k00029cxob0mn70c3",
      name: "Test doctor",
      speciality: "General doctor",
      profilePictureUrl: "",
    },
    patient: {
      id: "clz8bwlz9002w9cxocxqzkwik",
      name: "Vijaysai",
      email: "test@gmail.com",
      phoneNumber: "+911234567890",
      isd_code: "+91",
    },
    ailment: {
      id: "clzl6pyqx0003ru5kqp1yre28",
      name: "Fever",
    },
    doctorSlots: {
      doctorId: "clz8bgm9k00029cxob0mn70c3",
      weekDaysId: "clz8blpm0001l9cxolobdd8ms",
      id: "clzmb5fx10021r00g3c6wl7l3",
      slot: {
        id: "clzmb0dlf0008r00g6d4ioq7h",
        startTime: "08:00 AM",
        endTime: "09:00 AM",
        hospitalId: "clz8bfjq800009cxohb5i0s11",
      },
    },
  },
  {
    id: "clzmboszg0002iy18ty19sf56",
    appointmentDate: "2024-08-10T10:00:00.000Z",
    appointmentStatus: "CONFIRMED",
    doctor: {
      id: "clz8bgm9k00029cxob0mn70c4",
      name: "Dr. Smith",
      speciality: "Cardiologist",
      profilePictureUrl: "",
    },
    patient: {
      id: "clz8bwlz9002w9cxocxqzkwil",
      name: "John Doe",
      email: "john.doe@gmail.com",
      phoneNumber: "+911234567891",
      isd_code: "+91",
    },
    ailment: {
      id: "clzl6pyqx0003ru5kqp1yre29",
      name: "Chest Pain",
    },
    doctorSlots: {
      doctorId: "clz8bgm9k00029cxob0mn70c4",
      weekDaysId: "clz8blpm0001l9cxolobdd8mt",
      id: "clzmb5fx10021r00g3c6wl7l4",
      slot: {
        id: "clzmb0dlf0008r00g6d4ioq7i",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        hospitalId: "clz8bfjq800009cxohb5i0s12",
      },
    },
  },
];


const AppointmentsPage = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [noOfPages, setNoOfPages] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardContent>
          <div className="table-header flex justify-between w-full mb-2 mt-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
              <DatePicker
                date={date}
                setDate={setDate}
                placeholder="Filter by date"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-muted-foreground text-sm font-normal "
                  >
                    Filter by status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                  // onClick={() => handleViewOrEdit(item, "view")}
                  >
                    <Hourglass className="mr-2 h-4 w-4" />
                    Scheduled
                  </DropdownMenuItem>
                  <DropdownMenuItem
                  // onClick={() => handleViewOrEdit(item, "view")}
                  >
                    <CalendarCheck className="mr-2 h-4 w-4" /> Confirmed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                  // onClick={() => handleViewOrEdit(item, "view")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Completed
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <X className="mr-2 h-4 w-4" />
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date & Time
                </TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment: Appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    <div className="font-medium">
                      {appointment.patient.name}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {appointment.patient.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{appointment.doctor.name}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {`${format(appointment.appointmentDate, "dd-MM-yyyy")}, ${
                      appointment.doctorSlots.slot.startTime
                    }`}
                  </TableCell>
                  <TableCell className="capitalize">
                    {appointment.appointmentStatus.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(
                              `${APP_ROUTES.APPOINTMENT_DETAILS}/${appointment.id}`
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                />
              </PaginationItem>
              <div className="flex gap-4 items-center">
                <Input
                  value={currentPage}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  className="w-8 text-center px-1 h-7"
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (isNaN(value) || value < 1 || value > noOfPages) {
                      setCurrentPage(1);
                    } else {
                      setCurrentPage(value);
                    }
                  }}
                />
                <p>of {noOfPages} pages</p>
              </div>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev === noOfPages ? noOfPages : prev + 1
                    )
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentsPage;
