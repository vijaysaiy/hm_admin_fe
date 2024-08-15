import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientRecord } from "@/types";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { useState } from "react";

const patientList: PatientRecord[] = [
  {
    id: "clzi2kmpg000672al8y1q3qza",
    createdAt: "2024-08-06T06:59:00.724Z",
    updatedAt: "2024-08-06T06:59:00.724Z",
    hospitalId: "clz8bfjq800009cxohb5i0s11",
    patientId: "clz8bwlz9002w9cxocxqzkwik",
    patient: {
      name: "Vijaysai",
      id: "clz8bwlz9002w9cxocxqzkwik",
      phoneNumber: "+911234567890",
      gender: "OTHERS",
      dateOfBirth: "2024-07-29T18:26:09.497Z",
      bloodGroup: "A+",
      isd_code: "+91",
      email: "test@gmail.com",
    },
  },
  {
    id: "clzi2kmpg000672al8y1q3qzb",
    createdAt: "2024-08-07T06:59:00.724Z",
    updatedAt: "2024-08-07T06:59:00.724Z",
    hospitalId: "clz8bfjq800009cxohb5i0s12",
    patientId: "clz8bwlz9002w9cxocxqzkwil",
    patient: {
      name: "John Doe",
      id: "clz8bwlz9002w9cxocxqzkwil",
      phoneNumber: "+911234567891",
      gender: "MALE",
      dateOfBirth: "2024-07-30T18:26:09.497Z",
      bloodGroup: "B+",
      isd_code: "+91",
      email: "john.doe@gmail.com",
    },
  },
  {
    id: "clzi2kmpg000672al8y1q3qzc",
    createdAt: "2024-08-08T06:59:00.724Z",
    updatedAt: "2024-08-08T06:59:00.724Z",
    hospitalId: "clz8bfjq800009cxohb5i0s13",
    patientId: "clz8bwlz9002w9cxocxqzkwim",
    patient: {
      name: "Jane Smith",
      id: "clz8bwlz9002w9cxocxqzkwim",
      phoneNumber: "+911234567892",
      gender: "FEMALE",
      dateOfBirth: "2024-07-31T18:26:09.497Z",
      bloodGroup: "O+",
      isd_code: "+91",
      email: "jane.smith@gmail.com",
    },
  },
];
const PatientsPage = () => {
  const [noOfPages, setNoOfPages] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
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
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="font-medium">
                <TableCell>Patient Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Email</TableCell>
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
                  <TableCell>
                    {format(record.patient.dateOfBirth, "PP")}
                  </TableCell>
                  <TableCell>{record.patient.bloodGroup}</TableCell>
                  <TableCell>{record.patient.email}</TableCell>
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
            Showing <strong>1-10</strong> of <strong>32</strong> patients
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientsPage;
