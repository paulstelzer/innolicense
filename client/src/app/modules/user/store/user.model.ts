export interface UserStateModel {
  user?: UserModel;
  token?: string;
}

export interface UserModel {
  id: number;
  email: string;
  password: string;
  language: string;
  name: string;
  verified: boolean;
  roles: string[];
}