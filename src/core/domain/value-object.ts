export interface ValueObject<T> {
  equals(other: ValueObject<T>): boolean;
}
