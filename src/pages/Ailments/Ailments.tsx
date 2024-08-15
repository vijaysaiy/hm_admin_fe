import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Ailment } from "@/types";
import { Edit, Eye, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import AilmentForm from "./AilmentForm";

const ailments: Ailment[] = [
  {
    id: "clzl6psws0001ru5km8nwpfg2",
    createdAt: "2024-08-08T11:18:19.036Z",
    updatedAt: "2024-08-08T11:18:19.036Z",
    name: "Hand pain",
    description: null,
    isActive: true,
    isDefault: false,
    isDeleted: false,
    hospitalId: "clz8bfjq800009cxohb5i0s11",
  },
  {
    id: "clzl6pyqx0003ru5kqp1yre28",
    createdAt: "2024-08-08T11:18:26.601Z",
    updatedAt: "2024-08-08T11:18:26.601Z",
    name: "Fever",
    description: null,
    isActive: true,
    isDefault: false,
    isDeleted: false,
    hospitalId: "clz8bfjq800009cxohb5i0s11",
  },
  {
    id: "clzl6q2aw0005ru5kb4u28fic",
    createdAt: "2024-08-08T11:18:31.209Z",
    updatedAt: "2024-08-08T11:18:31.209Z",
    name: "Cold",
    description: null,
    isActive: true,
    isDefault: false,
    isDeleted: false,
    hospitalId: "clz8bfjq800009cxohb5i0s11",
  },
  {
    id: "clzl6q6ox0007ru5k77wupf8b",
    createdAt: "2024-08-08T11:18:36.897Z",
    updatedAt: "2024-08-08T11:18:36.897Z",
    name: "Chest pain",
    description: null,
    isActive: true,
    isDefault: false,
    isDeleted: false,
    hospitalId: "clz8bfjq800009cxohb5i0s11",
  },
  {
    id: "clzl6qcui0009ru5kqby26m3s",
    createdAt: "2024-08-08T11:18:44.874Z",
    updatedAt: "2024-08-08T11:18:44.874Z",
    name: "Knee pain",
    description: null,
    isActive: true,
    isDefault: false,
    isDeleted: false,
    hospitalId: "clz8bfjq800009cxohb5i0s11",
  },
  {
    id: "clzva3jhb0003al3w4xer5d1p",
    createdAt: "2024-08-15T12:50:40.607Z",
    updatedAt: "2024-08-15T12:50:40.607Z",
    name: "aug 15",
    description: "aug 15",
    isActive: true,
    isDefault: false,
    isDeleted: false,
    hospitalId: "clz8bfjq800009cxohb5i0s11",
  },
];
type mode = "view" | "edit" | "create" | null;

const Ailments = () => {
  const [showCreateAilment, setShowCreateAilment] = useState(false);
  const [selectedAilment, setSelectedAilment] = useState<Ailment | null>(null);
  const [formMode, setFormMode] = useState<mode>(null);

  const handleViewOrEdit = (ailment: Ailment, mode: mode) => {
    setSelectedAilment(ailment);
    setFormMode(mode);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardContent>
          <div className="flex flex-1 flex-col gap-4  md:gap-8">
            <div className="flex justify-between items-center w-full mb-2 mt-4 flex-wrap">
              <div className="relative ">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => {
                  setFormMode("create");
                  setShowCreateAilment(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Ailment
                </span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              {ailments.map((item: Ailment, index: number) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="text-lg font-semibold">{item.name}</h4>
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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {item.description || "No description available"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {formMode !== null && (
        <AilmentForm
          showCreateAilment={showCreateAilment}
          selectedAilment={selectedAilment}
          mode={formMode}
          setMode={setFormMode}
        />
      )}
    </div>
  );
};

export default Ailments;
