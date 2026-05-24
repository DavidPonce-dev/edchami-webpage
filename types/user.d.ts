export interface User {
  id: number;
  email: string;
  username: string;
  role?: 'reader' | 'editor'| 'admin';
  profilePicture?: string;
}

export interface UserResponse extends User {
  token: string;
}

export interface UserRegisterReq {
  email: string;
  password: string;
  username: string;
}

export interface UserRegisterRes {
  error: string | null;
  message: string | null;
  user: User | null;
}

export interface UserLoginReq {
  email: string;
  password: string;
  remember: boolean;
}

export interface UserLoginRes extends Omit<UserRegisterRes, "user"> {
  user: UserResponse | null;
}
