import { Department, User } from "@nsp/departments";

export interface NSPChallengeDatabase {
  departments: Department[];
  users: User[];
}