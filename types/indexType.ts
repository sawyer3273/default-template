type UserDataType = {
  id: number;
  email: string,
  username: string,
  rate: number,
  role: RoleType,
  token: string,
};

type RoleType = "ADMIN" | "USER" | "SUBUSER" | "MASTER"
type DataModels = "user" | "person" | "movie" | "intuitionPack" | "castPack" | "quizPack" | "library" | "quizPackRound"
type DataFunctions = "getActors" 


export type {
  UserDataType,
  RoleType, 
  DataModels,
  DataFunctions
};