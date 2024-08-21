/* eslint-disable @typescript-eslint/ban-ts-comment */

import { IUpdateDoctor } from "./types";

// Map RHF's dirtyFields over the `data` received by `handleSubmit` and return the changed subset of that data.
export function dirtyValues(
  dirtyFields: object | boolean,
  allValues: object
): object {
  // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
  // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;
  // Here, we have an object
  // @ts-ignore
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      // @ts-ignore
      dirtyValues(dirtyFields[key], allValues[key]),
    ])
  );
}

export const statusClasses: { [key: string]: string } = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  APPROVED: "bg-purple-100 text-purple-800",
};

export const replaceNullWithEmptyString = (
  obj: IUpdateDoctor["doctorDetails"]
): IUpdateDoctor["doctorDetails"] => {
  return Object.fromEntries(
    Object.entries(obj as { [s: string]: string }).map(([key, value]) => {
      if (value === null) {
        return [key, ""];
      } else if (typeof value === "object" && value !== null) {
        return [key, replaceNullWithEmptyString(value)];
      } else {
        return [key, value];
      }
    })
  );
};
