import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const details = {
  id: "clzmfh8m10008iy18au6d3r31",
  appointmentDate: "2024-08-14T18:30:00.000Z",
  appointmentStatus: "SCHEDULED",
  hospitalId: "clz8bfjq800009cxohb5i0s11",
  patientAppointmentDocs: [
    {
      id: "clzmfh8m90009iy18hz89ml0i",
      bucketPath:
        "patients/clz8bwlz9002w9cxocxqzkwik/records/1723191079958-updated final draft.pdf",
      documentName: "updated final draft.pdf",
      fileExtension: "PDF",
      fileName: "updated final draft.pdf",
      documentTypes: {
        id: "clzl6s6k8000hru5ky7ntiqjd",
        name: "MRI",
      },
      signedUrl:
        "https://s3.ap-south-1.amazonaws.com/dev-hms-01a7-assets.tech42.in/patients/clz8bwlz9002w9cxocxqzkwik/records/1723191079958-updated%20final%20draft.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZAN7IW3SERD6IOQO%2F20240815%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240815T143734Z&X-Amz-Expires=3600&X-Amz-Signature=2cfa9beed75fa6327d72e7a196118dbce1dc6854de33cd943a59ac2873d3829f&X-Amz-SignedHeaders=host&x-id=GetObject",
    },
  ],
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
    bloodGroup: "A+",
  },
  ailment: {
    id: "clzl6q6ox0007ru5k77wupf8b",
    name: "Chest pain",
  },
  doctorSlots: {
    dayOfWeek: {
      id: "clz8blpm0001k9cxomxu8yl75",
      name: "Thursday",
    },
    id: "clzmb5ylr002hr00gwhk3e5bl",
    slot: {
      id: "clzmb0dlf0008r00g6d4ioq7h",
      startTime: "08:00 AM",
      endTime: "09:00 AM",
    },
  },
};

const AppointmentDetails = () => {
  useEffect(() => {
    const header = document.getElementById("header-title");
    if (header) {
      header.innerText = "Appointment Details";
    }
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardContent>
          <div className="table-header flex justify-between w-full mb-2 mt-4">
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentDetails;
