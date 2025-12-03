import { Document } from 'mongoose';

export interface IUser {
  email: string;
  username: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidate_password: string): Promise<boolean>;
}

export interface IUserResponse {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
