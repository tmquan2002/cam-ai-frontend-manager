export function isEmpty(value: string | null | undefined) {
  return (
    value == null || (typeof value === "string" && value.trim().length === 0)
  );
}
