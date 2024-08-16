/* eslint-disable @typescript-eslint/ban-ts-comment */
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
