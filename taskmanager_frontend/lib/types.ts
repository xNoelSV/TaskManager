export type TokenRes = {
  access_token: string;
  expires_in: number; // seconds
  token_type: "Bearer";
};

export type RegisterReq = {
  username: string;
  email: string;
  password: string;
};

export type LoginReq = {
  usernameOrEmail: string;
  password: string;
};

export type TaskDTO = {
  id?: number;
  title?: string;
  description?: string;
  // response brings label ("To Do"), but to send it uses enum (below)
  status?: string;
  createdById?: number;
  updatedById?: number;
  createdAt?: string;
  updatedAt?: string;
};
