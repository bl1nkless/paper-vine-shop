export type UserRole = "owner" | "admin" | "editor";

export type User = {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
};
