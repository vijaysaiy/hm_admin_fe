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
import { getPatientList } from "@/https/admin-service";
import { PatientRecord } from "@/types";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import NoDataFound from "./NoDataFound";

const PatientsPage = () => {
  const [noOfPages, setNoOfPages] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);
  const [patientList, setPatientList] = useState<PatientRecord[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = patientList.length + startIndex - 1;

  const handleError = useErrorHandler();

  const fetchPatientList = async () => {
    try {
      setIsFetching(true);
      const response = await getPatientList({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
        search: search,
      });
      const data = response.data.data.patientList;
      const total = response.data.data.meta.totalMatchingRecords;
      setPatientList(data);
      setTotalRecords(total);
      setNoOfPages(Math.ceil(total / rowsPerPage));
    } catch (error) {
      handleError(error, "Failed to fetch patient list");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPatientList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, search]);

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, 900);

  if (!isFetching && search === "" && patientList.length === 0) {
    return <NoDataFound message="No Patients found" />;
  }
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
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
              {isFetching && (
                <div className="flex gap-1 ml-40 items-start text-muted-foreground">
                  <Spinner />
                  Looking for patients....
                </div>
              )}
            </div>
          </div>
          <Table className={isFetching ? "pointer-events-none" : ""}>
            <TableHeader>
              <TableRow className="font-medium">
                <TableCell>Patient Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell className="hidden md:table-cell">
                  Date of Birth
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  Blood Group
                </TableCell>
                <TableCell className="hidden md:table-cell">Email</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientList.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.patient.name}</TableCell>
                  <TableCell>{record.patient.phoneNumber}</TableCell>
                  <TableCell className="capitalize">
                    {record.patient.gender.toLowerCase()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(record.patient.dateOfBirth, "PP")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {record.patient.bloodGroup}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {record.patient.email}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex-wrap gap-4">
          <Pagination className="w-fit">
            <PaginationContent className="flex-wrap gap-2 items-center">
              <PaginationItem className="flex gap-2 items-center">
                <p className="text-sm">Rows per page:</p>
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
              <PaginationItem className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev === noOfPages ? noOfPages : prev + 1
                    )
                  }
                >
                  <ChevronRight className="w-3 h-3" />{" "}
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-xs text-muted-foreground">
            {
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <strong>
                  {startIndex}-{endIndex}
                </strong>{" "}
                of <strong>{totalRecords}</strong> patients
              </div>
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientsPage;
