import {
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
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useErrorHandler from "@/hooks/useError";
import { getAppointmentList } from "@/https/admin-service";
import { Appointment } from "@/types";
import { statusClasses } from "@/utils";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../NoDataFound";

type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "";

const statusToText = {
  SCHEDULED: {
    icon: <Hourglass className="mr-2 h-4 w-4" />,
    text: "Scheduled",
  },
  COMPLETED: {
    icon: <CheckCircle2 className="mr-2 h-4 w-4" />,
    text: "Completed",
  },
  CANCELLED: {
    icon: <X className="mr-2 h-4 w-4" />,
    text: "Cancelled",
  },
};
const AppointmentsPage = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [noOfPages, setNoOfPages] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);
  const [appointmentsList, setAppointmentList] = useState<Appointment[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [appointmentStatus, setAppointmentStatus] =
    useState<AppointmentStatus>("");

  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = appointmentsList?.length + startIndex - 1;

  const handleError = useErrorHandler();

  const fetchAppointmentList = async () => {
    try {
      setIsFetching(true);
      const response = await getAppointmentList({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
        appointmentStatus: appointmentStatus,
        search,
      });
      const data = response.data.data.appointmentList;
      const totalRecords = response.data.data.meta.totalMatchingRecords;
      setTotalRecords(totalRecords);
      setNoOfPages(Math.ceil(totalRecords / rowsPerPage));
      setAppointmentList(data);
    } catch (error) {
      handleError(error, "Failed to fetch medicine list");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, 900);

  useEffect(() => {
    fetchAppointmentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, appointmentStatus, search]);

  if (!isFetching && search === "" && appointmentsList.length === 0) {
    return <NoDataFound message="No appointments found" />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardContent>
          <div className="table-header flex items-center w-full mb-2 mt-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={handleSearch}
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
                    className="text-muted-foreground text-sm font-normal"
                  >
                    {appointmentStatus !== "" ? (
                      <p className="flex items-center">
                        {statusToText[appointmentStatus].icon}
                        {statusToText[appointmentStatus].text}
                      </p>
                    ) : (
                      "Filter by status"
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setAppointmentStatus("SCHEDULED")}
                  >
                    <Hourglass className="mr-2 h-4 w-4" />
                    Scheduled
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setAppointmentStatus("COMPLETED")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Completed
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setAppointmentStatus("CANCELLED")}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelled
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setAppointmentStatus("")}>
                    Clear Filter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isFetching && (
              <div className="flex gap-1 ml-10 items-start text-muted-foreground ">
                <Spinner />
                Looking for appointments....
              </div>
            )}
          </div>
          <Table className={isFetching ? "pointer-events-none" : ""}>
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
              {appointmentsList?.map((appointment: Appointment) => (
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
                    <p
                      className={`badge ${
                        statusClasses[appointment.appointmentStatus]
                      } px-2 py-1 rounded-lg text-xs w-[90px] text-center capitalize self-start`}
                    >
                      {appointment.appointmentStatus.toLowerCase()}
                    </p>
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
                <p>Rows per page:</p>
              </PaginationItem>
              <PaginationItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-7 gap-1">
                      {rowsPerPage}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setRowsPerPage(5)}>
                      5
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRowsPerPage(10)}>
                      10
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRowsPerPage(25)}>
                      25
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRowsPerPage(50)}>
                      50
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRowsPerPage(100)}>
                      100
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </PaginationItem>
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
            {
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <strong>
                  {startIndex}-{endIndex}
                </strong>{" "}
                of <strong>{totalRecords}</strong> appointments
              </div>
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentsPage;
