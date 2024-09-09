/**
 * Type narrowing to allow property checking when object can be multiple types
 * https://fettblog.eu/typescript-hasownproperty/
 * Any code inside a block guarded by a conditional call to this function will have type narrowed to X
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(prop);
}

export function isObject(val: unknown) {
  return val ? typeof val === "object" : false;
}
