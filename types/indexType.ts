type UserDataType = {
  id: number;
  email: string,
  username: string,
  rate: number,
  role: RoleType,
  token: string,
};

type RoleType = "ADMIN" | "USER" | "SUBUSER" | "MASTER"


export type {
  UserDataType,
  RoleType, 
};