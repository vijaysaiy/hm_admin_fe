import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useErrorHandler from "@/hooks/useError";
import { getFeedbackList } from "@/https/admin-service";
import { Feedbacks } from "@/types";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const AppointmentFeedbackPage = () => {
  const [noOfPages, setNoOfPages] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);
  const [feedbackList, setFeedBackList] = useState<Feedbacks[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = feedbackList.length + startIndex - 1;

  const handleError = useErrorHandler();

  const getchFeedbackList = async () => {
    try {
      setIsFetching(true);
      const response = await getFeedbackList({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
        search: search,
      });
      console.log("dataaaa", response.data);
      const data = response.data.data.feedbackList;
      const total = response.data.data.meta.totalMatchingRecords;
      setFeedBackList(data);
      setTotalRecords(total);
      setNoOfPages(Math.ceil(total / rowsPerPage));
    } catch (error) {
      handleError(error, "Failed to fetch feedback list");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getchFeedbackList();
  }, [currentPage, rowsPerPage, search]);

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, 400);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardContent>
          <div className="table-header flex justify-between w-full mb-2 mt-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={handleSearch}
                  type="search"
                  placeholder="Patient / Doctor name"
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
              {isFetching && (
                <div className="flex gap-1 ml-40 items-start text-muted-foreground">
                  <Spinner />
                  Looking for feedbacks....
                </div>
              )}
            </div>
          </div>
          <Table className={isFetching ? "pointer-events-none" : ""}>
            <TableHeader>
              <TableRow className="font-medium">
                <TableCell>Patient Name</TableCell>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Appointment Date</TableCell>
                <TableCell>Overall Satisfication</TableCell>
                <TableCell>remarks</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackList.map((record) => (
                <TableRow key={record.id.toString()}>
                  <TableCell>{record.appointment.patient.name}</TableCell>
                  <TableCell>{record.appointment.doctor.name}</TableCell>
                  <TableCell>
                    {format(record.appointment.appointmentDate, "PP")}
                  </TableCell>
                  <TableCell>{record.overallSatisfaction.toString()}</TableCell>
                  <TableCell>{record.feedBackRemarks}</TableCell>
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
                      prev === noOfPages ? noOfPages : prev + 1,
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
                of <strong>{totalRecords}</strong> feedbacks
              </div>
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentFeedbackPage;
