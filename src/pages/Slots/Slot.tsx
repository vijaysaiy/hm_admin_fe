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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/spinner";
import useErrorHandler from "@/hooks/useError";
import { deleteSlot, getSlotList, createSLot } from "@/https/admin-service";
import { Slots } from "@/types";
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NoDataFound from "../NoDataFound";

type mode = "view" | "edit" | "create" | null;

const Slot = () => {
  const [showCreateSlot, setShowCreateSlot] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slots | null>(null);
  const [formMode, setFormMode] = useState<mode>(null);
  const [slotList, setSlotList] = useState<Slots[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSlotId, setDeleteSlotId] = useState<string | null | undefined>(
    null,
  );

  const handleError = useErrorHandler();

  const handleViewOrEdit = (slot: Slots, mode: mode) => {
    setSelectedSlot(slot);
    setFormMode(mode);
  };

  const fetchSlotList = async () => {
    try {
      setIsFetching(true);
      const response = await getSlotList();
      const data = response.data.data.slotList;
      setSlotList(data);
    } catch (error) {
      handleError(error, "Failed to fetch slot list");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async () => {
    if (deleteSlotId) {
      try {
        setIsDeleting(true);
        await deleteSlot(deleteSlotId);
        toast.success("Slot deleted successfully");
        fetchSlotList();
      } catch (error) {
        handleError(error, "Failed to delete slot");
      } finally {
        setIsDeleting(false);
        setDeleteSlotId(null);
      }
    }
  };

  useEffect(() => {
    formMode === null && fetchSlotList();
  }, [formMode]);

  useEffect(() => {
    if (formMode === null) {
      setSelectedSlot(null);
    }
  }, [formMode]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardContent>
          <div className="flex flex-1 flex-col gap-4  md:gap-8">
            <div className="flex justify-between items-center w-full mb-2 mt-4 flex-wrap">
              <div className="relative flex items-center">
                {isFetching && (
                  <div className="flex gap-1 ml-40 items-start text-muted-foreground">
                    <Spinner />
                    Looking for slots....
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => {
                  setFormMode("create");
                  setShowCreateSlot(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Slot
                </span>
              </Button>
            </div>

            {slotList.length === 0 ? (
              <NoDataFound message="No Slots Found" />
            ) : (
              <div
                className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5  ${
                  isFetching ? "pointer-events-none" : ""
                }`}
              >
                {slotList.map((item: Slots, index: number) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="text-m">
                          {item.startTime} - {item.endTime}
                        </h4>
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
                              onClick={() => setDeleteSlotId(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        open={deleteSlotId !== null}
        onOpenChange={() => setDeleteSlotId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              slot from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteSlotId(null)}>
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

export default Slot;
