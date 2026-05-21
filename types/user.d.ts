export interface User {
  id: number;
  email: string;
  isAdmin?: boolean;
}

export interface UserResponse extends User {
  token: string;
}

export interface UserRegisterReq {
  email: string;
  password: string;
}

export interface UserRegisterRes {
  error: string | null;
  message: string | null;
  user: User | null;
}

export interface UserLoginReq extends UserRegisterReq {
  remember: boolean;
}

export interface UserLoginRes extends Omit<UserRegisterRes, "user"> {
  user: UserResponse | null;
}
