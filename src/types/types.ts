export type Modify<T, R> = Omit<T, keyof R> & R;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Common<A, B> = {
  [P in keyof A & keyof B]: A[P] | B[P];
};

// Utility type to convert enum to union type of its values
export type EnumValues<T> = T[keyof T];

// Utility type to convert enum to union type of its keys
export type EnumKeys<T> = keyof T;

export interface IBaseResponseSchema {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
