export interface IUser {
  id: string;
  nickname: string;
  email: string;
  created: string;
  updated: string;
  theme: string | null;
  registeredWithGoogle: boolean;
  googleId: string | null;
}
