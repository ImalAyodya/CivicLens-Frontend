export interface Role {
  title: string;
}

export interface Party {
  fullName: string;
}

export type Status = "Active" | "Inactive" | "Pending";

export interface Politician {
  id: string;
  name: string;
  image: string;
  currentRole: Role;
  party: Party;
  region: string;
  status: Status;
}
