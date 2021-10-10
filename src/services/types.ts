export type LoginBody = {
  username: string;
  password: string;
};

export type SignupBody = {
  username: string;
  email: string;
  password: string;
};

export type ApiResponse = {
  err: string;
  result: unknown;
  status: number;
  success: boolean;
};
