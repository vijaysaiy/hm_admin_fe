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
import { deleteMedicine, getMedicineList } from "@/https/admin-service";
import { ICreateMedicationForm } from "@/types";
import { format } from "date-fns";
import { Edit, Eye, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MedicineForm from "./MedicineForm";

type mode = "view" | "edit" | "create" | null;

const Medicines = () => {
  const [noOfPages, setNoOfPages] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showCreateMedicine, setShowCreateMedicine] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<ICreateMedicationForm | null>(null);
  const [formMode, setFormMode] = useState<mode>(null);

  const [medicinesList, setMedicinesList] = useState<ICreateMedicationForm[]>(
    []
  );
  const [deleteMedicineId, setDeleteMedicineId] = useState<
    string | null | undefined
  >(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = medicinesList.length + startIndex - 1;

  const handleError = useErrorHandler();

  const handleViewOrEdit = (medicine: ICreateMedicationForm, mode: mode) => {
    setSelectedMedicine(medicine);
    setFormMode(mode);
    setShowCreateMedicine(true);
  };
  const fetchMedicineList = async () => {
    try {
      setIsFetching(true);
      const response = await getMedicineList({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
      });
      const data = response.data.data.medicationList;
      const totalRecords = response.data.data.meta.totalMatchingRecords;
      setTotalRecords(totalRecords);
      setNoOfPages(Math.ceil(totalRecords / rowsPerPage));
      setMedicinesList(data);
    } catch (error) {
      handleError(error, "Failed to fetch medicine list");
    } finally {
      setIsFetching(true);
    }
  };

  const handleDelete = async () => {
    if (deleteMedicineId) {
      try {
        setIsDeleting(true);
        await deleteMedicine(deleteMedicineId);
        toast.success("Medicine deleted successfully");
        fetchMedicineList();
      } catch (error) {
        handleError(error, "Failed to delete medicine");
      } finally {
        setIsDeleting(false);
        setDeleteMedicineId(null);
      }
    }
  };

  useEffect(() => {
    formMode === null && fetchMedicineList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, formMode]);

  useEffect(() => {
    if (formMode === null) {
      setSelectedMedicine(null);
    }
  }, [formMode]);

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
              {isFetching && (
                <div className="flex gap-1 ml-40 items-start text-muted-foreground">
                  <Spinner />
                  Looking for medicines....
                </div>
              )}
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
          <Table className={isFetching ? "pointer-events-none" : ""}>
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
              {medicinesList.map(
                (item: ICreateMedicationForm, index: number) => (
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
                          <DropdownMenuItem
                            onClick={() => setDeleteMedicineId(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              )}
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
                of <strong>{totalRecords}</strong> medicines
              </div>
            }
          </div>
        </CardFooter>
      </Card>

      {formMode !== null && (
        <MedicineForm
          showCreateMedicine={showCreateMedicine}
          setShowCreateMedicine={setShowCreateMedicine}
          selectedMedicine={selectedMedicine}
          mode={formMode}
          setMode={setFormMode}
        />
      )}

      <AlertDialog
        open={deleteMedicineId !== null}
        onOpenChange={() => setDeleteMedicineId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              medicine from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteMedicineId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
              }}
            >
              Continue
              {isDeleting && <Spinner type="light" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Medicines;
