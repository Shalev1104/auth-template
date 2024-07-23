export const nullToUndefinedOrValue = <T>(val: T | null): T | undefined =>
  val === null ? undefined : val;
export const undefinedToNullOrValue = <T>(val: T | undefined): T | null =>
  val === undefined ? null : val;

export const executeOrUndefined = <TVal, TIns>(
  val: TVal | undefined,
  execute: (val: NonNullable<TVal>) => TIns,
): TIns | undefined => (!val ? undefined : execute(val));
