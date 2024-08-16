import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { ICreateMedicationForm } from "@/types";
import { format } from "date-fns";
import { Edit, Eye, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import MedicineForm from "./MedicineForm";

const data: ICreateMedicationForm[] = [
  {
    medicationName: "Coughgo 230",
    code: "764985984",
    description: "Coughgo 230",
    manufacturer: "HUL",
    expirationDate: "2024-08-05T09:46:12.110Z",
    dosageForm: "Tablet",
    medicationDosage: "230mgc",
    hospitalId: "clz8bfjq800009cxohb5i0s11",
  },
  {
    medicationName: "PainRelief 500",
    code: "123456789",
    description: "PainRelief 500",
    manufacturer: "PharmaCorp",
    expirationDate: "2025-01-15T10:30:00.000Z",
    dosageForm: "Capsule",
    medicationDosage: "500mg",
    hospitalId: "clz8bfjq800009cxohb5i0s12",
  },
  {
    medicationName: "AllergyFree",
    code: "987654321",
    description: "AllergyFree",
    manufacturer: "HealthPlus",
    expirationDate: "2023-12-01T08:00:00.000Z",
    dosageForm: "Syrup",
    medicationDosage: "100ml",
    hospitalId: "clz8bfjq800009cxohb5i0s13",
  },
  {
    medicationName: "Antibiotic A",
    code: "456789123",
    description: "Antibiotic A",
    manufacturer: "MediCare",
    expirationDate: "2024-05-20T12:00:00.000Z",
    dosageForm: "Tablet",
    medicationDosage: "250mg",
    hospitalId: "clz8bfjq800009cxohb5i0s14",
  },
  {
    medicationName: "Vitamin D",
    code: "321654987",
    description: "Vitamin D",
    manufacturer: "NutriLife",
    expirationDate: "2026-07-10T14:00:00.000Z",
    dosageForm: "Tablet",
    medicationDosage: "1000IU",
    hospitalId: "clz8bfjq800009cxohb5i0s15",
  },
];
type mode = "view" | "edit" | "create" | null;

const Medicines = () => {
  const [noOfPages, setNoOfPages] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateMedicine, setShowCreateMedicine] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<ICreateMedicationForm | null>(null);
  const [formMode, setFormMode] = useState<mode>(null);

  const handleViewOrEdit = (medicine: ICreateMedicationForm, mode: mode) => {
    setSelectedMedicine(medicine);
    setFormMode(mode);
    setShowCreateMedicine(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardContent>
          <div className="table-header flex justify-between items-center w-full mb-2 mt-4 flex-wrap">
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
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1"
                onClick={() => {
                  setFormMode("create");
                  setShowCreateMedicine(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Medicine
                </span>
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Dosage Form</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: ICreateMedicationForm, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.medicationName}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>{format(item.expirationDate, "PP")}</TableCell>
                  <TableCell>{item.dosageForm}</TableCell>
                  <TableCell>{item.medicationDosage}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewOrEdit(item, "view")}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewOrEdit(item, "edit")}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {formMode !== null && (
        <MedicineForm
          showCreateMedicine={showCreateMedicine}
          setShowCreateMedicine={setShowCreateMedicine}
          selectedMedicine={selectedMedicine}
          mode={formMode}
        />
      )}
    </div>
  );
};

export default Medicines;
