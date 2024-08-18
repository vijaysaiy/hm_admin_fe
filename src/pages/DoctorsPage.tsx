import { ChevronLeft, ChevronRight, File, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-picker";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddDoctorForm from "@/forms/AddDoctorForm";
import { useState } from "react";

const DoctorsPage = () => {
  const [date, setDate] = useState<Date | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [noOfPages, _setNoOfPages] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
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
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1"
                onClick={() => setShowAddDoctorForm(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Doctor
                </span>
              </Button>
              <Button size="sm" variant="outline" className="h-7 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Patient Age</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date & Time
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="font-medium">Liam Johnson</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    liam@example.com
                  </div>
                </TableCell>
                <TableCell>32</TableCell>
                <TableCell>
                  <div className="font-medium">Liam Johnson</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    liam@example.com
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  2023-07-12 10:42 AM
                </TableCell>
                <TableCell>
                  <Badge variant={"success"}>Completed</Badge>
                </TableCell>
              </TableRow>
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
                      {10}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {}}>5</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>10</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>25</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>50</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>100</DropdownMenuItem>
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
                Showing <strong>5</strong> of <strong>{`10`}</strong> users
              </div>
            }
          </div>
        </CardFooter>
      </Card>

      <AddDoctorForm
        showAddDoctorForm={showAddDoctorForm}
        setShowAddDoctorForm={setShowAddDoctorForm}
      />
    </div>
  );
};

export default DoctorsPage;
