// Enum for User Roles
export type UserRole = "admin" | "user";

// Enum for Gender
export type Gender = "male" | "female";

// Type for Users Table
export interface User {
  id: number; // serial type
  username: string; // varchar(100)
  userRole: UserRole; // enum
  accessSecret: string; // varchar(255)
}

// Type for User Profiles Table
export interface Profile {
  id: number; // serial type
  userId: number; // integer type
  displayName: string; // varchar(100)
  gender: Gender; // enum
  biography: string; // text
  isActivated: boolean; // boolean
  activationSecret: string; // varchar(255)
  profileImageUrl: string; // varchar(500)
}

// Type for Compliments Table
export interface Compliment {
  id: number; // serial type
  userId: number; // integer type
  profileId: number; // integer type
  title: string;
  content: string; // text
  author: Profile;
  recipient: Profile;
  likes: number;
  isAdmin: boolean;
  createdAt: Date;
}

export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
