export const nullToUndefinedOrValue = <T>(val: T | null): T | undefined =>
  val === null ? undefined : val;
export const undefinedToNullOrValue = <T>(val: T | undefined): T | null =>
  val === undefined ? null : val;
